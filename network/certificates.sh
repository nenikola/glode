

echo "***********************************************************"
echo "***** Registracija i generisanje sertifikata ucesnika *****"
echo "***********************************************************"

PATH=${PWD}/../bin:${PATH}
. scripts/partyNcertificates.sh

echo "================================== OceanCarrierA ========================================"
echo

certificates "ocA"

echo
echo
echo
echo "================================== OceanCarrierB ========================================"
echo

certificates "ocB"

echo
echo
echo
echo "================================== InlandTransporterA ========================================"
echo

certificates "itA"

echo
echo
echo
echo "================================== InlandTransporterB ========================================"
echo

certificates "itB"

echo
echo
echo
echo "================================== FrightForwarderA ========================================"
echo

certificates "ffA"