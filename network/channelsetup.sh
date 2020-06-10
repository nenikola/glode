export FABRIC_CFG_PATH=$PWD/configtx/

mkdir channel-artifacts

../bin/configtxgen -profile OrdererGenesis -outputBlock ./channel-artifacts/genesis.block -channelID glode-sys-channel

../bin/configtxgen -profile Channel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID glode-channel

../bin/configtxgen -profile Channel -outputAnchorPeersUpdate ./channel-artifacts/ocAMSPanchors.tx -channelID glode-channel -asOrg ocAMSP

../bin/configtxgen -profile Channel -outputAnchorPeersUpdate ./channel-artifacts/ocBMSPanchors.tx -channelID glode-channel -asOrg ocBMSP

../bin/configtxgen -profile Channel -outputAnchorPeersUpdate ./channel-artifacts/itAMSPanchors.tx -channelID glode-channel -asOrg itAMSP

../bin/configtxgen -profile Channel -outputAnchorPeersUpdate ./channel-artifacts/itBMSPanchors.tx -channelID glode-channel -asOrg itBMSP

../bin/configtxgen -profile Channel -outputAnchorPeersUpdate ./channel-artifacts/ffAMSPanchors.tx -channelID glode-channel -asOrg ffAMSP