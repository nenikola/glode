function certificates() {
if [ -z "$1" ]; then
   echo "Shortname of party must be specified."
   echo "example: For organisation OceanCarrierA call function as"
   echo
   echo "         $ certificates \"ocA\""
   echo
  return 1 # or return 0, or even you can omit the argument.
fi

export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/$1.glode.com/

echo "> FABRIC_CA_CLIENT_HOME: ${FABRIC_CA_CLIENT_HOME}"
echo 
echo "---------- Generisanje sertifikata Fabric CA admin ------------------"
echo
set -x
fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-$1 --tls.certfiles ${PWD}/organizations/fabric-ca/$1/tls-cert.pem
set +x

echo
echo "---------- Registracija peer0.$1.glode.com ---------------"
echo
set -x
../bin/fabric-ca-client register --caname ca-$1 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/$1/tls-cert.pem
set +x

echo
echo "---------- Registracija user-a --------------------------------------"
echo
set -x
fabric-ca-client register --caname ca-$1 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/$1/tls-cert.pem
set +x

echo
echo "---------- Registracija admin-a $1 --------------------------------------"
echo
set -x
fabric-ca-client register --caname ca-$1 --id.name $1admin --id.secret $1adminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/$1/tls-cert.pem
set +x

echo
echo "---------- Registracija orderer-a -----------------------------------"
echo
set -x
fabric-ca-client register --caname ca-$1 --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/$1/tls-cert.pem
set +x

echo
echo "---------- Generisanje MSP-a za peer0.$1.glode.com --------------------------------------"
echo
mkdir -p organizations/peerOrganizations/$1.glode.com/peers
mkdir -p organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com

set -x	
fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-$1 -M ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/msp --csr.hosts peer0.$1.glode.com --tls.certfiles ${PWD}/organizations/fabric-ca/$1/tls-cert.pem
set +x
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/msp/config.yaml

echo
echo "---------- Generisanje TLS-a za peer0.$1.glode.com --------------------------------------"
echo
set -x
fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-$1 -M ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/tls --enrollment.profile tls --csr.hosts peer0.$1.glode.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/$1/tls-cert.pem
set +x

cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/tls/ca.crt
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/tls/server.crt
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/tls/server.key
mkdir ${PWD}/organizations/peerOrganizations/$1.glode.com/msp/tlscacerts
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/$1.glode.com/msp/tlscacerts/ca.crt
mkdir ${PWD}/organizations/peerOrganizations/$1.glode.com/tlsca
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/$1.glode.com/tlsca/tlsca.$1.glode.com-cert.pem
mkdir ${PWD}/organizations/peerOrganizations/$1.glode.com/ca
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/peer0.$1.glode.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/$1.glode.com/ca/ca.$1.glode.com-cert.pem

echo
echo "---------- Generisanje MSP-a za orderer.$1.glode.com --------------------------------------"
echo
mkdir -p organizations/peerOrganizations/$1.glode.com/peers
mkdir -p organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com

set -x	
fabric-ca-client enroll -u https://orderer:ordererpw@localhost:7054 --caname ca-$1 -M ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/msp --csr.hosts orderer.$1.glode.com --tls.certfiles ${PWD}/organizations/fabric-ca/$1/tls-cert.pem
set +x
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/msp/config.yaml

echo
echo "---------- Generisanje TLS-a za orderer.$1.glode.com --------------------------------------"
echo
set -x
fabric-ca-client enroll -u https://orderer:ordererpw@localhost:7054 --caname ca-$1 -M ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/tls --enrollment.profile tls --csr.hosts orderer.$1.glode.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/$1/tls-cert.pem
set +x

cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/tls/ca.crt
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/tls/server.crt
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/tls/server.key
mkdir ${PWD}/organizations/peerOrganizations/$1.glode.com/msp/tlscacerts
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/$1.glode.com/msp/tlscacerts/ca.crt
mkdir ${PWD}/organizations/peerOrganizations/$1.glode.com/tlsca
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/$1.glode.com/tlsca/tlsca.$1.glode.com-cert.pem
mkdir ${PWD}/organizations/peerOrganizations/$1.glode.com/ca
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/peers/orderer.$1.glode.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/$1.glode.com/ca/ca.$1.glode.com-cert.pem

echo
echo "---------- Generisanje MSP-a za user-a --------------------------------------"
echo
mkdir -p organizations/peerOrganizations/$1.glode.com/users
mkdir -p organizations/peerOrganizations/$1.glode.com/users/User1@$1.glode.com

set -x
fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-$1 -M ${PWD}/organizations/peerOrganizations/$1.glode.com/users/User1@$1.glode.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/$1/tls-cert.pem
set +x


echo
echo "---------- Generisanje MSP-a za admin-a $1 --------------------------------------"
echo
mkdir -p organizations/peerOrganizations/$1.glode.com/users/Admin@$1.glode.com

set -x
fabric-ca-client enroll -u https://$1admin:$1adminpw@localhost:7054 --caname ca-$1 -M ${PWD}/organizations/peerOrganizations/$1.glode.com/users/Admin@$1.glode.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/$1/tls-cert.pem
set +x
cp ${PWD}/organizations/peerOrganizations/$1.glode.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/$1.glode.com/users/Admin@$1.glode.com/msp/config.yaml

}