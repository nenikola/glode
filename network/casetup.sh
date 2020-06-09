CA_IMAGETAG="1.4.6"
IMAGETAG="latest"
COMPOSE_FILE_CA=docker/docker-compose-ca.yaml

echo "########################################################"
echo "####### Postavljanje CA servera za organizacije ########"
echo "########################################################"

echo "********************************************************"
echo "**** Provera da li je instaliran Fabric CA Client *****"
echo "********************************************************"


../bin/fabric-ca-client version > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Fabric CA client nije pronadjen, downloading..."
  cd ..
  curl -s -L "https://github.com/hyperledger/fabric-ca/releases/download/v${CA_IMAGETAG}/hyperledger-fabric-ca-${OS_ARCH}-${CA_IMAGETAG}.tar.gz" | tar xz
if [ -n "$rc" ]; then
    echo "> Doslo je do greske prilikom preuzimanja fajla."
    echo "fabric-ca-client binary nije dostupan za preuzimanje"
else
    echo "> Preuzeto."
  cd glode
fi
else
  echo "> Fabric CA Client je instaliran."
fi
echo "********************************************************"
echo "******* Pokretanje neophodnih docker kontejnera ********"
echo "********************************************************"

export IMAGE_TAG=${CA_IMAGETAG}

docker-compose -f $COMPOSE_FILE_CA up -d 2>&1

docker ps -a

