import { readFileSync } from 'node:fs'

export interface Config {
  port: number
  protocol: string
  sslKeyPath: string
  sslCertificatePath: string
  apiNode: {
    host: string
    port: number
    tlsClientCertificatePath: string
    tlsClientKeyPath: string
    tlsCaCertificatePath: string
    timeout: number
    networkPropertyFilePath: string
    nodePropertyFilePath: string
    inflationPropertyFilePath: string
  }
  logging: {
    console: {
      level: string
    }
    file: {
      level: string
      filename: string
    }
  }
}

export class ConfigManager {
  private static instance: ConfigManager | undefined

  private configData: Config | undefined

  private constructor(configFilePath?: string) {
    try {
      const configData = readFileSync(configFilePath ? configFilePath : './config/rest.json', 'utf8')
      this.configData = JSON.parse(configData)
    } catch {
      throw new Error('Error loading config file')
    }
  }

  static init(configFilePath?: string) {
    if (this.instance) throw new Error('Instances already exist.')
    this.instance = new ConfigManager(configFilePath)
    return this.instance
  }

  static getInstance() {
    if (!this.instance) throw new Error('Instance does not exist.')
    return this.instance
  }

  get config() {
    if (!this.configData) throw new Error('Error loading config file')
    return this.configData
  }
}
