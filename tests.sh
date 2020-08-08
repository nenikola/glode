docker-compose -f docker/docker-compose.yaml up

export FABRIC_CFG_PATH=${PWD}
export PATH=${PWD}/../bin:${PWD}:${PATH}


export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ocAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ocA.glode.com/users/Admin@ocA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:7051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ocBMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ocB.glode.com/peers/peer0.ocB.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ocB.glode.com/users/Admin@ocB.glode.com/msp
export CORE_PEER_ADDRESS=localhost:8051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="itAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/itA.glode.com/users/Admin@itA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:9051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="itBMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/itB.glode.com/peers/peer0.itB.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/itB.glode.com/users/Admin@itB.glode.com/msp
export CORE_PEER_ADDRESS=localhost:10051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ffAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ffA.glode.com/peers/peer0.ffA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ffA.glode.com/users/Admin@ffA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:11051


#>>> CHANNEL CREATION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
peer channel create -o localhost:7050 -c glode-channel -f ./channel-artifacts/channel.tx --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem

peer channel join -b ./glode-channel.block 

peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com -c glode-channel -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem

#>>> PACKAGING AND INSTALLING CHAICODE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

export PACKAGE_NAME=transfer

export PACKAGE_NAME=transferEquipment

export SIGNATURE_POLICY="OR ('ocAMSP.peer','itAMSP.peer','itBMSP.peer','ffAMSP.peer')"

peer lifecycle chaincode package ${PACKAGE_NAME}.tar.gz --path ../chaincode/${PACKAGE_NAME}/ --lang node --label ${PACKAGE_NAME}_1

peer lifecycle chaincode install ${PACKAGE_NAME}.tar.gz

export SEQUENCE=$(($SEQUENCE + 1))

#>>> APPROVING CHAINCODE DEFINITION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com --channelID glode-channel --name ${PACKAGE_NAME} --version 1 --package-id $CC_PACKAGE_ID --sequence $SEQUENCE --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem --signature-policy "${SIGNATURE_POLICY}"

#------ocA

#>>transfer
# peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com --channelID glode-channel --name transfer --version 1 --package-id $CC_PACKAGE_ID --sequence $SEQUENCE --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem --signature-policy "AND ('ocAMSP.peer','itAMSP.peer')"

#>>transferEquipment
# peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com --channelID glode-channel --name ${PACKAGE_NAME} --version 1 --package-id $CC_PACKAGE_ID --sequence $SEQUENCE --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem --signature-policy "OR ('ocAMSP.peer','itAMSP.peer','itBMSP.peer','ffAMSP.peer')"

#------ocB

#------itA

#>>transfer
# peer lifecycle chaincode approveformyorg -o localhost:9050 --ordererTLSHostnameOverride orderer.itA.glode.com --channelID glode-channel --name transfer --version 1 --package-id $CC_PACKAGE_ID --sequence $SEQUENCE --tls --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem --signature-policy "AND ('ocAMSP.peer','itAMSP.peer')"

#------itB

#------ffA



#>>> CHECK COMMIT READINESS
peer lifecycle chaincode checkcommitreadiness --channelID glode-channel --name ${PACKAGE_NAME} --version 1 --sequence $SEQUENCE --tls --cafile ./organizations/peerOrganizations/ffA.glode.com/peers/orderer.ffA.glode.com/tls/tlscacerts/tls-localhost-11054-ca-ffA.pem --output json --signature-policy "${SIGNATURE_POLICY}"




#------transfer
# peer lifecycle chaincode checkcommitreadiness --channelID glode-channel --name transfer --version 1 --sequence $SEQUENCE --tls --cafile ./organizations/peerOrganizations/ffA.glode.com/peers/orderer.ffA.glode.com/tls/tlscacerts/tls-localhost-11054-ca-ffA.pem --output json --signature-policy "AND ('ocAMSP.peer','itAMSP.peer')"


#>>> COMMIT CHAINCODE TO CHANNEL
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com --channelID glode-channel --name ${PACKAGE_NAME} --version 1 --sequence $SEQUENCE --signature-policy "${SIGNATURE_POLICY}" --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt

#  --peerAddresses localhost:8051 --tlsRootCertFiles ./organizations/peerOrganizations/ocB.glode.com/peers/peer0.ocB.glode.com/tls/ca.crt 
#  --peerAddresses localhost:10051 --tlsRootCertFiles ./organizations/peerOrganizations/itB.glode.com/peers/peer0.itB.glode.com/tls/ca.crt 
#  --peerAddresses localhost:11051 --tlsRootCertFiles ./organizations/peerOrganizations/ffA.glode.com/peers/peer0.ffA.glode.com/tls/ca.crt

#------transfer
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.ocA.glode.com --channelID glode-channel --name transfer --version 1 --sequence $SEQUENCE --signature-policy "AND ('ocAMSP.peer','itAMSP.peer')" --tls --cafile ./organizations/peerOrganizations/ocA.glode.com/peers/orderer.ocA.glode.com/tls/tlscacerts/tls-localhost-7054-ca-ocA.pem --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt
  --peerAddresses localhost:10051 --tlsRootCertFiles ./organizations/peerOrganizations/itB.glode.com/peers/peer0.itB.glode.com/tls/ca.crt

#=====================================================================================================================================================================================================================================================================================================================================================================================================================
#=====================================================================================================================================================================================================================================================================================================================================================================================================================
#=====================================================================================================================================================================================================================================================================================================================================================================================================================
#=====================================================================================================================================================================================================================================================================================================================================================================================================================
#=====================================================================================================================================================================================================================================================================================================================================================================================================================
#=====================================================================================================================================================================================================================================================================================================================================================================================================================

export FABRIC_CFG_PATH=${PWD}
export PATH=${PWD}/../bin:${PWD}:${PATH}


export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ocAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ocA.glode.com/users/Admin@ocA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:7051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ocBMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ocB.glode.com/peers/peer0.ocB.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ocB.glode.com/users/Admin@ocB.glode.com/msp
export CORE_PEER_ADDRESS=localhost:8051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="itAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/itA.glode.com/users/Admin@itA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:9051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="itBMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/itB.glode.com/peers/peer0.itB.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/itB.glode.com/users/Admin@itB.glode.com/msp
export CORE_PEER_ADDRESS=localhost:10051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ffAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ffA.glode.com/peers/peer0.ffA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ffA.glode.com/users/Admin@ffA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:11051
#=====================================================================================================================================================================================================================================================================================================================================================================================================================
#------transfer

export TRANSFER_SECRET="bkPI7sM+Xc/nUFCmQc7pukyRZ0j5JNrHNI/roFWI75T1pKXkuN7i4reoFzXZcPqRETgJ/oR/kEU8DgCvj4J9HTvIBkkqWeiyT+ykpBI5U533b7bl6eAIKdIZOjtfMUpYt6oVYxZVHDotYvtJXUJ8PtDV6ag4Ck7ASHy0u73esmYOeOFRhSywZtbxsfD5pZigmmvmlsdZ5QwcS0fawBUw6pRVjuYB2VOPh/edTk4IgvbRWbZ4Wtd6pBg0X1D7uJChtKaoWmbIq66jdj1CLrVmyuddTs78huVYhqA7eK4kN2spnJodYF2H26F7vYn+ry6GJNEL2bXBbtS9L5TMyPJzsw=="

#>>> Create transfer as ocA w/o participants
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["createTransfer","{\"bookingNumber\":\"1234\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}}}"]}'

peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["createTransfer","{\"bookingNumber\":\"1111\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"transferVehicleID\":\"VESSEL111\",\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"},\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"}}}"]}'
 
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["validateExistingTransfer","{\"bookingNumber\":\"1234\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}}}"]}'
peer chaincode invoke --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["validateExistingTransfer","{\"bookingNumber\":\"1234\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}}}"]}'

#>>> Create transfer as ocA w/ participants
#bookingNumber=1234 ocA
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["createTransfer","{\"bookingNumber\":\"1234\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}},\"participants\":[{\"participantID\":\"itA\",\"participantName\":\"Inland Transporter A\",\"role\":1}]}","${TRANSFER_SECRET}"]}'
#bookingNumber=2345 itA
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["createTransfer","{\"bookingNumber\":\"1234\",\"transportServiceProviderID\":\"itA\",\"transportServiceProviderName\":\"Inland Transporter A\",\"transferStatus\":1,\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}},\"participants\":[{\"participantID\":\"ocA\",\"participantName\":\"Ocean Carrier A\",\"role\":1}]}"]}'
#bookingNumber=2345
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["createTransfer","{\"bookingNumber\":\"2345\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}},\"participants\":[{\"participantID\":\"itA\",\"participantName\":\"Inland Transporter A\",\"role\":1}]}"]}'

#>>> ValidateTransferPTCP as itB
#bookingNumber=1234 ocA
peer chaincode invoke --peerAddresses localhost:10051 --tlsRootCertFiles ./organizations/peerOrganizations/itB.glode.com/peers/peer0.itB.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["validateTransferParticipant","ocA","1234"]}'

#>>> ValidateTransferPTCP as itA
#bookingNumber=1234 ocA
peer chaincode invoke --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["validateTransferParticipant","ocA","1234"]}'


 #>>> Read transfer as ocA
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["readTransfer","ocA","1234"]}'

 #>>> Read all transfer by ocA as itA
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["readAllOrgTransfers","ocA"]}'

peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["addTransferParticipant","1234","itA","Inland Transporter A","2"]}'

peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["updateTransferParticipants","transferocA1234","[{\"participantID\":\"itA\",\"participantName\":\"Inland Transporter A\",\"role\":1}]"]}'
#=====================================================================================================================================================================================================================================================================================================================================================================================================================
#=====================================================================================================================================================================================================================================================================================================================================================================================================================


#--------transferEquipment
# peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c "{\"Args\":[\"createTransferEquipment\",\"${TE_SRB1234}\"]}"
#>>> Create TE_SRB1234 (endorsing: ocA.peer)
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["createTransferEquipment","{\"registrationNumber\":\"SRB1234\",\"ownerID\":\"ocA\",\"transferStatus\":0,\"transferEquipmentType\":1,\"currentLocation\":{\"unlocode\":\"KPSLO\"}}"]}'
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["createTransferEquipment","{\"registrationNumber\":\"SRB1234\",\"ownerID\":\"ocA\",\"transferStatus\":0,\"transferEquipmentType\":1,\"currentLocation\":{\"unlocode\":\"KPSLO\"}}"]}'

#>>> Associate transfer 1234 with TE_SRB1234 (endorsing: ocA.peer)
# peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","SRB1234","transferocA1234"]}'
# peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","SRB1234","{\"bookingNumber\":\"1234\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}}}"]}'
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","SRB1234","ocA","1234"]}'

#>>> Associate transfer 1234 with TE_SRB1234 (endorsing: itA.peer, ocA.peer)
peer chaincode invoke --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","SRB1234","ocA","1234"]}'

#>>> Associate transfer 1234 with TE_SRB1234 (endorsing: itA.peer)
peer chaincode invoke --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","SRB1234","ocA","1234"]}'

#>>> Associate transfer 2345 with TE_SRB1234 (endorsing: ocA.peer)
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","SRB1234","{\"bookingNumber\":\"1234\",\"transportServiceProviderID\":\"itA\",\"transportServiceProviderName\":\"Inland Transporter A\",\"transferStatus\":1,\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}},\"participants\":[{\"participantID\":\"ocA\",\"participantName\":\"Ocean Carrier A\",\"role\":1}]}"]}'

#>>> Associate transfer 3456 with TE_SRB1234 (endorsing: ocA.peer)
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","SRB1234","{\"bookingNumber\":\"3456\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}},\"participants\":[{\"participantID\":\"itA\",\"participantName\":\"Inland Transporter A\",\"role\":1}]}"]}'


#>>> Update TE location as itA [ registrationNumber: string, tspID: string, bookingNumber: string, locationString: string] (endorsing: itA.peer)
peer chaincode invoke --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["updateCurrentLocation","SRB1234","ocA","1234","{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}"]}'

#>>> Update TE location as ocA [ registrationNumber: string, tspID: string, bookingNumber: string, locationString: string] (endorsing: ocA.peer)
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["updateCurrentLocation","SRB1234","ocA","1234","{\"address\":{\"address\":\"Koper Street 222\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"}"]}'

#=====================================================================================================================================================================================================================================================================================================================================================================================================================
############ ocA-itA-ffA connected transfers and TE ###############################
#=====================================================================================================================================================================================================================================================================================================================================================================================================================
export PACKAGE_NAME=transfer
export PACKAGE_NAME=booking
export PACKAGE_NAME=transferEquipment

#>>> Create B tsp: ocA booker: ffA
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles ./organizations/peerOrganizations/ffA.glode.com/peers/peer0.ffA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["createBooking","{\"bookingNotes\":\"Some booking notes...\",\"bookingOrgID\":\"ffA\",\"bookingStatus\":\"SUBMITTED\",\"equipmentData\":{\"transferEquipmentQuantity\":1,\"transferEquipmentType\":\"20_FEET_CONTAINER\"},\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\",\"geoCoordinates\":{\"lat\":45.0232,\"lon\":23.2434}},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"},\"requestedDeparture\":\"2020-06-26T13:24:13.048Z\"},\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"uniqueAssociatedTransfersSecret\":\"ffa-oca-1593455358000\"}"]}'


#>>> Create T 1111 owner: ocA buyer: ffA
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles ./organizations/peerOrganizations/ffA.glode.com/peers/peer0.ffA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["createTransfer","{\"bookingNumber\":\"1111\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"transferVehicleID\":\"VESSEL111\",\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"},\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"}},\"participants\":[{\"participantID\":\"ffA\",\"participantName\":\"Fright Forwarder A\",\"role\":0}]}","ffa-booking-secret"]}'
#>>> Create T 2222 owner: itA buyer: ffA
peer chaincode invoke --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles ./organizations/peerOrganizations/ffA.glode.com/peers/peer0.ffA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["createTransfer","{\"bookingNumber\":\"2222\",\"transportServiceProviderID\":\"itA\",\"transportServiceProviderName\":\"Inland Transporter A\",\"transferStatus\":1,\"transferData\":{\"transferVehicleID\":\"TRUCK-ITA-111\",\"destinationLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"originLocation\":{\"address\":{\"address\":\"Vienna Street 111\",\"city\":\"Vienna\",\"country\":\"Austria\"},\"unlocode\":\"VIEAT\"}},\"participants\":[{\"participantID\":\"ffA\",\"participantName\":\"Fright Forwarder A\",\"role\":0}]}","ffa-booking-secret"]}'
#>>> Create T 2223 owner: itA buyer: ffA
peer chaincode invoke --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles ./organizations/peerOrganizations/ffA.glode.com/peers/peer0.ffA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["createTransfer","{\"bookingNumber\":\"2223\",\"transportServiceProviderID\":\"itA\",\"transportServiceProviderName\":\"Inland Transporter A\",\"transferStatus\":1,\"transferData\":{\"transferVehicleID\":\"TRUCK-ITA-111\",\"destinationLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"originLocation\":{\"address\":{\"address\":\"Vienna Street 111\",\"city\":\"Vienna\",\"country\":\"Austria\"},\"unlocode\":\"VIEAT\"}},\"participants\":[{\"participantID\":\"ffA\",\"participantName\":\"Fright Forwarder A\",\"role\":0}]}","ita-booking-secret"]}'

#>>> Create T 1112 owner: ocA buyer: itA
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["createTransfer","{\"bookingNumber\":\"1112\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"transferVehicleID\":\"VESSEL111\",\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"},\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"}},\"participants\":[{\"participantID\":\"itA\",\"participantName\":\"Inland Transporter A\",\"role\":0}]}","ita-booking-secret"]}'
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n transfer -c '{"Args":["createTransfer","{\"bookingNumber\":\"1112\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"transferVehicleID\":\"VESSEL111\",\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"},\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"}},\"participants\":[{\"participantID\":\"itA\",\"participantName\":\"Inland Transporter A\",\"role\":0}]}","ffa-booking-secret"]}'

#>>> Create TE CONT0001 owner: ocA
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["createTransferEquipment","{\"registrationNumber\":\"CONT0001\",\"ownerID\":\"ocA\",\"transferStatus\":0,\"transferEquipmentType\":1,\"currentLocation\":{\"address\":{\"address\":\"Vienna Street 111\",\"city\":\"Vienna\",\"country\":\"Austria\"},\"unlocode\":\"VIEAT\"}}"]}'
#>>> Create TE CONT0002 owner: ocA
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["createTransferEquipment","{\"registrationNumber\":\"CONT0002\",\"ownerID\":\"ocA\",\"transferStatus\":0,\"transferEquipmentType\":1,\"currentLocation\":{\"address\":{\"address\":\"Vienna Street 111\",\"city\":\"Vienna\",\"country\":\"Austria\"},\"unlocode\":\"VIEAT\"}}"]}'

#>>> Assign TE CONT0001 to T[ocA1111]
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","CONT0001","ocA","1111"]}'
#>>> Assign TE CONT0001 to T[ocA1112]
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","CONT0001","ocA","1112"]}'
#>>> Assign TE CONT0001 to T[itA2222]
peer chaincode invoke --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","CONT0001","itA","2222"]}'
#>>> Assign TE CONT0001 to T[itA2223]
peer chaincode invoke --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","CONT0001","itA","2223"]}'

#>>> Assign TE CONT0002 to T[ocA1111]
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","CONT0002","ocA","1111"]}'
#>>> Assign TE CONT0002 to T[itA2222]
peer chaincode invoke --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["addAssociatedTransfer","CONT0002","itA","2222"]}'

#>>> Submit event [COMMODITY_LOADED] as itA T[itA2222] TE[CONT0001] -> ok
peer chaincode invoke --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["submitTransferEquipmentEvent","{\"associatedTransferData\":{\"tspID\":\"itA\",\"bookingNumber\":\"2222\"},\"eventLocation\":{\"unlocode\":\"VIEAT\"},\"eventOccuranceTime\":\"2020-06-28T13:24:13.048Z\",\"transferEquipmentEventType\":\"COMMODITY_LOADED\",\"registrationNumber\":\"CONT0001\"}"]}'
#>>> Submit event [COMMODITY_LOADED] as ocA T[ocA1112] TE[CONT0001] -> error
peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["submitTransferEquipmentEvent","{\"associatedTransferData\":{\"tspID\":\"ocA\",\"bookingNumber\":\"1112\"},\"eventLocation\":{\"unlocode\":\"VIEAT\"},\"eventOccuranceTime\":\"2020-06-28T13:24:13.048Z\",\"transferEquipmentEventType\":\"COMMODITY_LOADED\",\"registrationNumber\":\"CONT0001\"}"]}'


#=====================================================================================================================================================================================================================================================================================================================================================================================================================
#=====================================================================================================================================================================================================================================================================================================================================================================================================================

export FABRIC_CFG_PATH=${PWD}
export PATH=${PWD}/../bin:${PWD}:${PATH}


export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ocAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ocA.glode.com/users/Admin@ocA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:7051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ocBMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ocB.glode.com/peers/peer0.ocB.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ocB.glode.com/users/Admin@ocB.glode.com/msp
export CORE_PEER_ADDRESS=localhost:8051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="itAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/itA.glode.com/users/Admin@itA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:9051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="itBMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/itB.glode.com/peers/peer0.itB.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/itB.glode.com/users/Admin@itB.glode.com/msp
export CORE_PEER_ADDRESS=localhost:10051

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="ffAMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/ffA.glode.com/peers/peer0.ffA.glode.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/ffA.glode.com/users/Admin@ffA.glode.com/msp
export CORE_PEER_ADDRESS=localhost:11051
#=====================================================================================================================================================================================================================================================================================================================================================================================================================
#=====================================================================================================================================================================================================================================================================================================================================================================================================================
#=====================================================================================================================================================================================================================================================================================================================================================================================================================
########################################################################
# peer chaincode invoke -o orderer.itA.glode.com:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n qscc -c '{"function":"GetTransactionByID","Args":["glode-channel", "5c06d071"]}'


####>>> EXAMPLE DATA CONSTS

# export TE_SRB1234="{\"registrationNumber\":\"SRB1234\",\"ownerID\":\"ocA\",\"transferStatus\":0,\"transferEquipmentType\":1,\"currentLocation\":{\"unlocode\":\"KPSLO\"}}"

# export TRANS1234="{\"bookingNumber\":\"1234\",\"transportServiceProviderID\":\"ocA\",\"transportServiceProviderName\":\"Ocean Carrier A\",\"transferStatus\":1,\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}},\"participants\":[{\"participantID\":\"itA\",\"participantName\":\"Inland Transporter A\",\"role\":1}]}"

# export TRANS2345="{\"bookingNumber\":\"2345\",\"transportServiceProviderID\":\"itA\",\"transportServiceProviderName\":\"Inland Transporter A\",\"transferStatus\":2,\"transferData\":{\"originLocation\":{\"address\":{\"address\":\"Koper Street 111\",\"city\":\"Koper\",\"country\":\"Slovenia\"},\"unlocode\":\"KPSLO\"},\"destinationLocation\":{\"address\":{\"address\":\"Nantong Street 222\",\"city\":\"Nantong\",\"country\":\"China\"},\"unlocode\":\"NTCHN\"}}}"
​

# export TE_SRB1234='{
#             registrationNumber: "SRB1234",
#             ownerID: "ocA",
#             transferStatus: 0,
#             transferEquipmentType: 1,
#             currentLocation: {
#                 unlocode: "KPSLO"
#             }
#         }'

export BOOKING-FFA_OCA='{
              bookingNotes: "Some booking notes...",
              bookingOrgID: "ffA",
              bookingStatus: "SUBMITTED",
              equipmentData:{
                    transferEquipmentQuantity: 1,
                    transferEquipmentType: "20_FEET_CONTAINER",
              } ,
              transferData: {
                originLocation: {
                        address: {
                            address: "Koper Street 111",
                            city: "Koper",
                            country: "Slovenia"
                        },
                        unlocode: "KPSLO",
                        geoCoordinates: {
                            lat: 45.0232,
                            lon: 23.2434
                        }
                    },
                    destinationLocation: {
                        address: {
                            address: "Nantong Street 222",
                            city: "Nantong",
                            country: "China"
                        },
                        unlocode: "NTCHN"
                    },
                    requestedDeparture:"2020-06-26T13:24:13.048Z"
                },
              },
              transportServiceProviderID: "ocA",
              transportServiceProviderName: "Ocean Carrier A",
              uniqueAssociatedTransfersSecret: ffa-oca-1593455358000,
            }'


export TRANS1234='{
                bookingNumber: "1234",
                transportServiceProviderID: "ocA",
                transportServiceProviderName: "Ocean Carrier A",
                transferStatus: 1,
                transferData: {
                    originLocation: {
                        address: {
                            address: "Koper Street 111",
                            city: "Koper",
                            country: "Slovenia"
                        },
                        unlocode: "KPSLO",
                        geoCoordinates: {
                            lat: 45.0232,
                            lon: 23.2434
                        }
                    },
                    destinationLocation: {
                        address: {
                            address: "Nantong Street 222",
                            city: "Nantong",
                            country: "China"
                        },
                        unlocode: "NTCHN"
                    }
                },
                participants: [
                    {
                        participantID: "itA",
                        participantName: "Inland Transporter A",
                        role: 1
                    }
                ]
            }'

# export TRANS2345='{
#                 bookingNumber: "2345",
#                 transportServiceProviderID: "itA",
#                 transportServiceProviderName: "Inland Transporter A",
#                 transferStatus: 2,
#                 transferData: {
#                     originLocation: {
#                         address: {
#                             address: "Koper Street 111",
#                             city: "Koper",
#                             country: "Slovenia"
#                         },
#                         unlocode: "KPSLO"
#                     },
#                     destinationLocation: {
#                         address: {
#                             address: "Nantong Street 222",
#                             city: "Nantong",
#                             country: "China"
#                         },
#                         unlocode: "NTCHN"
#                     }
#                 }
#             }'

peer chaincode invoke --peerAddresses localhost:7051 --tlsRootCertFiles ./organizations/peerOrganizations/ocA.glode.com/peers/peer0.ocA.glode.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ./organizations/peerOrganizations/itA.glode.com/peers/peer0.itA.glode.com/tls/ca.crt -o localhost:9050 --tls true --cafile ./organizations/peerOrganizations/itA.glode.com/peers/orderer.itA.glode.com/tls/tlscacerts/tls-localhost-9054-ca-itA.pem -C glode-channel -n ${PACKAGE_NAME} -c '{"Args":["createTransferEquipment","{\"registrationNumber\":\"SRB1234\",\"ownerID\":\"ocA\",\"transferStatus\":0,\"transferEquipmentType\":1,\"currentLocation\":{\"unlocode\":\"KPSLO\"}}"]}'

# {
#     associatedTransferData: {
#         tspID: "itA",
#         bookingNumber: "2222",
#     },
#     eventLocation: { unlocode: "VIEAT" },
#     eventOccuranceTime: new Date(),
#     transferEquipmentEventType: "COMMODITY_LOADED",
#     registrationNumber: "CONT0001"
# }