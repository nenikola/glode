function ocAcertificates() {
export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/ocA.glode.com/

echo "> FABRIC_CA_CLIENT_HOME: ${FABRIC_CA_CLIENT_HOME}"
echo 
echo "---------- Generisanje sertifikata Fabric CA admin ------------------"
echo
set -x
fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-ocA --tls.certfiles ${PWD}/organizations/fabric-ca/ocA/tls-cert.pem
set +x

echo
echo "---------- Registracija peer0.ocA.glode.com ---------------"
echo
set -x
../bin/fabric-ca-client register --caname ca-ocA --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/ocA/tls-cert.pem
set +x

echo
echo "---------- Registracija user-a --------------------------------------"
echo
set -x
fabric-ca-client register --caname ca-ocA --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/ocA/tls-cert.pem
set +x

echo
echo "---------- Registracija admin-a ocA --------------------------------------"
echo
set -x
fabric-ca-client register --caname ca-ocA --id.name ocAadmin --id.secret ocAadminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/ocA/tls-cert.pem
set +x

echo
echo "---------- Registracija orderer-a -----------------------------------"
echo
set -x
fabric-ca-client register --caname ca-ocA --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ocA/tls-cert.pem
set +x

echo
echo "---------- Generisanje MSP-a za peer0.ocA.glode.com --------------------------------------"
echo
mkdir -p organizations/peerOrganizations/ocA.glode.com/peers
mkdir -p organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com

set -x	
fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-ocA -M ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/msp --csr.hosts peer0.ocA.glode.com --tls.certfiles ${PWD}/organizations/fabric-ca/ocA/tls-cert.pem
set +x
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/msp/config.yaml

echo
echo "---------- Generisanje TLS-a za peer0.ocA.glode.com --------------------------------------"
echo
set -x
fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-ocA -M ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls --enrollment.profile tls --csr.hosts peer0.ocA.glode.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ocA/tls-cert.pem
set +x

cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/server.crt
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/server.key
mkdir ${PWD}/organizations/peerOrganizations/ocA.glode.com/msp/tlscacerts
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/msp/tlscacerts/ca.crt
mkdir ${PWD}/organizations/peerOrganizations/ocA.glode.com/tlsca
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/tlsca/tlsca.ocA.glode.com-cert.pem
mkdir ${PWD}/organizations/peerOrganizations/ocA.glode.com/ca
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/ca/ca.ocA.glode.com-cert.pem

echo
echo "---------- Generisanje MSP-a za orderer.ocA.glode.com --------------------------------------"
echo
mkdir -p organizations/peerOrganizations/ocA.glode.com/peers
mkdir -p organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com

set -x	
fabric-ca-client enroll -u https://orderer:ordererpw@localhost:7054 --caname ca-ocA -M ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/msp --csr.hosts orderer.ocA.glode.com --tls.certfiles ${PWD}/organizations/fabric-ca/ocA/tls-cert.pem
set +x
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/msp/config.yaml

echo
echo "---------- Generisanje TLS-a za orderer.ocA.glode.com --------------------------------------"
echo
set -x
fabric-ca-client enroll -u https://orderer:ordererpw@localhost:7054 --caname ca-ocA -M ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls --enrollment.profile tls --csr.hosts orderer.ocA.glode.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ocA/tls-cert.pem
set +x

cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/ca.crt
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/server.crt
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/server.key
mkdir ${PWD}/organizations/peerOrganizations/ocA.glode.com/msp/tlscacerts
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/msp/tlscacerts/ca.crt
mkdir ${PWD}/organizations/peerOrganizations/ocA.glode.com/tlsca
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/tlsca/tlsca.ocA.glode.com-cert.pem
mkdir ${PWD}/organizations/peerOrganizations/ocA.glode.com/ca
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/ocA.glode.com/ca/ca.ocA.glode.com-cert.pem

echo
echo "---------- Generisanje MSP-a za user-a --------------------------------------"
echo
mkdir -p organizations/peerOrganizations/ocA.glode.com/users
mkdir -p organizations/peerOrganizations/ocA.glode.com/users/User1@ocA.glode.com

set -x
fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-ocA -M ${PWD}/organizations/peerOrganizations/ocA.glode.com/users/User1@ocA.glode.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ocA/tls-cert.pem
set +x


echo
echo "---------- Generisanje MSP-a za admin-a ocA --------------------------------------"
echo
mkdir -p organizations/peerOrganizations/ocA.glode.com/users/Admin@ocA.glode.com

set -x
fabric-ca-client enroll -u https://ocAadmin:ocAadminpw@localhost:7054 --caname ca-ocA -M ${PWD}/organizations/peerOrganizations/ocA.glode.com/users/Admin@ocA.glode.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ocA/tls-cert.pem
set +x
cp ${PWD}/organizations/peerOrganizations/ocA.glode.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/ocA.glode.com/users/Admin@ocA.glode.com/msp/config.yaml

}