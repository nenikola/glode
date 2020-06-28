export FABRIC_CFG_PATH=${PWD}
export PATH=${PWD}/../bin:${PWD}:${PATH}

export PACKAGE_NAME=$1
export VERSION=$2
export SEQUENCE=$3
export SIGNATURE_POLICY='OR ("ocAMSP.peer","itAMSP.peer","itBMSP.peer","ffAMSP.peer")'


echo
echo "===== DEPLOYING ${PACKAGE_NAME} CHAINCODE :: VERSION=${VERSION} :: SEQUENCE=${SEQUENCE}"
echo

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ocAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ocA.glode.com/users/Admin@ocA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:7051

echo "### PACKAGING ${PACKAGE_NAME} CHAINCODE..."
echo
peer lifecycle chaincode package ${PACKAGE_NAME}.tar.gz --path ../chaincode/${PACKAGE_NAME}/ --lang node --label ${PACKAGE_NAME}_$VERSION

echo "###(peer0.ocA) INSTALATION OF ${PACKAGE_NAME} CHAINCODE..."
echo

peer lifecycle chaincode install ${PACKAGE_NAME}.tar.gz

peer lifecycle chaincode queryinstalled >&log.txt

PACKAGE_ID=$(sed -n "/${PACKAGE_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)

echo "      >>> PACKAGE_ID: ${PACKAGE_ID}";
echo


echo "###(peer0.ocA) APPROVING ${PACKAGE_NAME} CHAINCODE (v: ${VERSION} | s: ${SEQUENCE} | sp: ${SIGNATURE_POLICY}))..."
echo
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com --channelID glode-channel --name ${PACKAGE_NAME} --version $VERSION --package-id $PACKAGE_ID --sequence $SEQUENCE --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem --signature-policy "${SIGNATURE_POLICY}"

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="itAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/itA.glode.com/users/Admin@itA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:9051

echo "###(peer0.ocA) INSTALATION OF ${PACKAGE_NAME} CHAINCODE..."
echo
peer lifecycle chaincode install ${PACKAGE_NAME}.tar.gz

echo "      >>> PACKAGE_ID: ${PACKAGE_ID}";
echo

echo "###(peer0.ocA) APPROVING ${PACKAGE_NAME} CHAINCODE (v: ${VERSION} | s: ${SEQUENCE} | sp: ${SIGNATURE_POLICY}))..."
echo
peer lifecycle chaincode approveformyorg -o localhost:9050 --ordererTLSHostnameOverride orderer.itA.glode.com --channelID glode-channel --name ${PACKAGE_NAME} --version $VERSION --package-id $PACKAGE_ID --sequence $SEQUENCE --tls --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem --signature-policy "${SIGNATURE_POLICY}"

echo
echo "###(peer0.ocA) CHECKING COMMIT READINESS FOR ${PACKAGE_NAME} CHAINCODE (v: ${VERSION} | s: ${SEQUENCE} | sp: ${SIGNATURE_POLICY})..."
echo
set -x
peer lifecycle chaincode checkcommitreadiness --channelID glode-channel --name ${PACKAGE_NAME} --version $VERSION --sequence $SEQUENCE --tls --cafile ./organizations/peerOrganizations/ffA.glode.com/peers/orderer.ffA.glode.com/tls/tlscacerts/tls-localhost-11054-ca-ffA.pem --output json --signature-policy "${SIGNATURE_POLICY}"
set +x

echo
echo
echo "###(peer0.ocA) COMMITING ${PACKAGE_NAME} CHAINCODE (v: ${VERSION} | s: ${SEQUENCE} | sp: ${SIGNATURE_POLICY}))..."
echo
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com --channelID glode-channel --name ${PACKAGE_NAME} --version $VERSION --sequence $SEQUENCE --signature-policy "${SIGNATURE_POLICY}" --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt 

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FINISHED <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"


# set -x 
# peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com --tls --cafile ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem  -C glode-channel -n ${PACKAGE_NAME} --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt    --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -c '{"function":"initLedger","Args":[]}' --isInit
# set +x


