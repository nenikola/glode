echo "#################################################################"
echo "###################### Zaustavljanje mreze ######################"
echo "#################################################################"

echo "Zaustavljanje docker kontejnera:"
docker kill $(docker ps -aq)
echo
echo "Brisanje docker kontejnera:"
docker rm $(docker ps -aq)

echo 
echo "Brisanje generisanih fajlova:"
set -x
rm -rf organizations/fabric-ca/ocA/msp organizations/fabric-ca/ocA/tls-cert.pem organizations/fabric-ca/ocA/ca-cert.pem organizations/fabric-ca/ocA/IssuerPublicKey organizations/fabric-ca/ocA/IssuerRevocationPublicKey organizations/fabric-ca/ocA/fabric-ca-server.db
rm -rf organizations/fabric-ca/ocB/msp organizations/fabric-ca/ocB/tls-cert.pem organizations/fabric-ca/ocB/ca-cert.pem organizations/fabric-ca/ocB/IssuerPublicKey organizations/fabric-ca/ocB/IssuerRevocationPublicKey organizations/fabric-ca/ocB/fabric-ca-server.db
rm -rf organizations/fabric-ca/itA/msp organizations/fabric-ca/itA/tls-cert.pem organizations/fabric-ca/itA/ca-cert.pem organizations/fabric-ca/itA/IssuerPublicKey organizations/fabric-ca/itA/IssuerRevocationPublicKey organizations/fabric-ca/itA/fabric-ca-server.db
rm -rf organizations/fabric-ca/itB/msp organizations/fabric-ca/itB/tls-cert.pem organizations/fabric-ca/itB/ca-cert.pem organizations/fabric-ca/itB/IssuerPublicKey organizations/fabric-ca/itB/IssuerRevocationPublicKey organizations/fabric-ca/itB/fabric-ca-server.db
rm -rf organizations/fabric-ca/ffA/msp organizations/fabric-ca/ffA/tls-cert.pem organizations/fabric-ca/ffA/ca-cert.pem organizations/fabric-ca/ffA/IssuerPublicKey organizations/fabric-ca/ffA/IssuerRevocationPublicKey organizations/fabric-ca/ffA/fabric-ca-server.db
rm -rf organizations/peerOrganizations/

rm -rf channel-artifacts
set +x

echo
echo "Brisanje docker volume-a:"
set -x
docker volume prune -f
set -x