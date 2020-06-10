

echo "***********************************************************"
echo "***** Registracija i generisanje sertifikata ucesnika *****"
echo "***********************************************************"

PATH=${PWD}/../bin:${PATH}
. scripts/partyNcertificates.sh

echo "================================== OceanCarrierA ========================================"
echo

certificates "ocA" 7054

echo
echo
echo
echo "================================== OceanCarrierB ========================================"
echo

certificates "ocB" 8054

echo
echo
echo
echo "================================== InlandTransporterA ========================================"
echo

certificates "itA" 9054

echo
echo
echo
echo "================================== InlandTransporterB ========================================"
echo

certificates "itB" 10054

echo
echo
echo
echo "================================== FrightForwarderA ========================================"
echo

certificates "ffA" 11054