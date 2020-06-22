import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml'

export function getConnectionProfile(orgId: string) {
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'network', 'organizations', 'fabric-ca', orgId, `connection-${orgId}-glode-channel.yaml`);
    const ccp = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));
    return ccp;
}