// ---------------------------------------------------------------------
// Instance Discourse de STAGING sur Azure.
//
// Usage prévu : tester les montées de version, le thème et les plugins
// avant de toucher la prod. C'est du dev/test au sens strict, donc
// conforme aux conditions du crédit Azure des abonnements Visual Studio.
//
// À NE PAS utiliser pour la production : ce crédit est explicitement
// réservé au dev/test, sans SLA, et Microsoft se réserve le droit de
// suspendre toute instance tournant en continu plus de 120 heures.
// D'où le script d'extinction automatique plus bas — il n'est pas là
// pour économiser du crédit, il est là pour rester dans les clous.
//
// Déploiement :
//   az group create -n rg-atelierhifi-staging -l francecentral
//   az deployment group create \
//     -g rg-atelierhifi-staging \
//     -f azure-staging.bicep \
//     -p sshPublicKey="$(cat ~/.ssh/id_ed25519.pub)"
//
// Destruction (à faire dès que tu as fini) :
//   az group delete -n rg-atelierhifi-staging --yes
// ---------------------------------------------------------------------

@description('Clé publique SSH pour l\'accès admin.')
param sshPublicKey string

@description('Préfixe de nommage des ressources.')
param prefix string = 'hifistg'

@description('Région. francecentral pour la latence et la localisation des données.')
param location string = 'francecentral'

@description('Taille de VM. B2as_v2 = 2 vCPU / 8 Go, largement suffisant pour un staging.')
param vmSize string = 'Standard_B2as_v2'

@description('Nom d\'utilisateur admin.')
param adminUsername string = 'nathan'

@description('Heure d\'extinction automatique (HHmm, fuseau ci-dessous).')
param autoShutdownTime string = '2000'

var vnetName = '${prefix}-vnet'
var nsgName = '${prefix}-nsg'
var vmName = '${prefix}-vm'

resource nsg 'Microsoft.Network/networkSecurityGroups@2023-11-01' = {
  name: nsgName
  location: location
  properties: {
    securityRules: [
      {
        name: 'ssh'
        properties: {
          priority: 100
          direction: 'Inbound'
          access: 'Allow'
          protocol: 'Tcp'
          sourceAddressPrefix: '*'
          sourcePortRange: '*'
          destinationAddressPrefix: '*'
          destinationPortRange: '22'
        }
      }
      {
        name: 'http'
        properties: {
          priority: 110
          direction: 'Inbound'
          access: 'Allow'
          protocol: 'Tcp'
          sourceAddressPrefix: '*'
          sourcePortRange: '*'
          destinationAddressPrefix: '*'
          destinationPortRange: '80'
        }
      }
      {
        name: 'https'
        properties: {
          priority: 120
          direction: 'Inbound'
          access: 'Allow'
          protocol: 'Tcp'
          sourceAddressPrefix: '*'
          sourcePortRange: '*'
          destinationAddressPrefix: '*'
          destinationPortRange: '443'
        }
      }
    ]
  }
}

resource vnet 'Microsoft.Network/virtualNetworks@2023-11-01' = {
  name: vnetName
  location: location
  properties: {
    addressSpace: { addressPrefixes: ['10.20.0.0/16'] }
    subnets: [
      {
        name: 'default'
        properties: {
          addressPrefix: '10.20.1.0/24'
          networkSecurityGroup: { id: nsg.id }
        }
      }
    ]
  }
}

resource pip 'Microsoft.Network/publicIPAddresses@2023-11-01' = {
  name: '${prefix}-pip'
  location: location
  sku: { name: 'Standard' }
  properties: {
    publicIPAllocationMethod: 'Static'
    dnsSettings: {
      // Donne un FQDN stable : hifistg-xxxx.francecentral.cloudapp.azure.com
      // Suffisant pour Let's Encrypt sur le staging, pas besoin d'un domaine.
      domainNameLabel: '${prefix}-${uniqueString(resourceGroup().id)}'
    }
  }
}

resource nic 'Microsoft.Network/networkInterfaces@2023-11-01' = {
  name: '${prefix}-nic'
  location: location
  properties: {
    ipConfigurations: [
      {
        name: 'ipconfig1'
        properties: {
          subnet: { id: vnet.properties.subnets[0].id }
          privateIPAllocationMethod: 'Dynamic'
          publicIPAddress: { id: pip.id }
        }
      }
    ]
  }
}

resource vm 'Microsoft.Compute/virtualMachines@2024-03-01' = {
  name: vmName
  location: location
  properties: {
    hardwareProfile: { vmSize: vmSize }
    osProfile: {
      computerName: vmName
      adminUsername: adminUsername
      linuxConfiguration: {
        disablePasswordAuthentication: true
        ssh: {
          publicKeys: [
            {
              path: '/home/${adminUsername}/.ssh/authorized_keys'
              keyData: sshPublicKey
            }
          ]
        }
      }
    }
    storageProfile: {
      imageReference: {
        publisher: 'Canonical'
        offer: 'ubuntu-24_04-lts'
        sku: 'server'
        version: 'latest'
      }
      osDisk: {
        createOption: 'FromImage'
        diskSizeGB: 64
        managedDisk: { storageAccountType: 'StandardSSD_LRS' }
      }
    }
    networkProfile: {
      networkInterfaces: [{ id: nic.id }]
    }
  }
}

// Extinction automatique quotidienne. Garde-fou contre l'oubli d'une VM
// allumée : au-delà de 120 h en continu, l'instance sort du cadre dev/test.
resource shutdown 'Microsoft.DevTestLab/schedules@2018-09-15' = {
  name: 'shutdown-computevm-${vmName}'
  location: location
  properties: {
    status: 'Enabled'
    taskType: 'ComputeVmShutdownTask'
    dailyRecurrence: { time: autoShutdownTime }
    timeZoneId: 'Romance Standard Time'
    targetResourceId: vm.id
    notificationSettings: {
      status: 'Disabled'
      timeInMinutes: 30
    }
  }
}

output sshCommand string = 'ssh ${adminUsername}@${pip.properties.dnsSettings.fqdn}'
output fqdn string = pip.properties.dnsSettings.fqdn
output rappel string = 'Staging uniquement. Détruis le groupe de ressources dès que tu as fini.'
