export FABRIC_CFG_PATH=${PWD}
export PATH=${PWD}/../bin:${PWD}:${PATH}

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ocAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ocA.glode.com/users/Admin@ocA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:7051

echo "### CREATING CHANNEL :: glode-channel"
peer channel create -o localhost:7050 -c glode-channel -f ./channel-artifacts/channel.tx --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem
echo "      >>> channel created."

echo "=========================================== ORG: ocA ==============================================================="
echo "###(peer0.ocA) JOINING CHANNEL :: glode-channel"
peer channel join -b ./glode-channel.block 

echo "###(peer0.ocA) UPDATING ANCHOR PEER :: glode-channel"
peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com -c glode-channel -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem



echo "=========================================== ORG: itA ==============================================================="
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="itAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/itA.glode.com/users/Admin@itA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:9051

echo "###(peer0.itA) JOINING CHANNEL :: glode-channel"
echo
peer channel join -b ./glode-channel.block 

echo "###(peer0.itA) UPDATING ANCHOR PEER :: glode-channel"
echo
peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com -c glode-channel -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem

echo "=========================================== ORG: itB ==============================================================="
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="itBMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/itB.glode.com/peers/peer0.itB.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/itB.glode.com/users/Admin@itB.glode.com/msp
export CORE_PEER_ADDRESS=localhost:10051

echo "###(peer0.itB) JOINING CHANNEL :: glode-channel"
echo
peer channel join -b ./glode-channel.block 

echo "###(peer0.itB) UPDATING ANCHOR PEER :: glode-channel"
echo
peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com -c glode-channel -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem

echo "=========================================== ORG: ffA ==============================================================="

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ffAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ffA.glode.com/peers/peer0.ffA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ffA.glode.com/users/Admin@ffA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:11051

echo "###(peer0.itB) JOINING CHANNEL :: glode-channel"
echo
peer channel join -b ./glode-channel.block 

echo "###(peer0.itB) UPDATING ANCHOR PEER :: glode-channel"
echo
peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com -c glode-channel -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FINISHED <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
