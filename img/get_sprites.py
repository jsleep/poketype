import json
import urllib2
import requests
import sys

baseURL = "http://pokeapi.co/"

def makeRequest (URI) :
    response = requests.get(URI)
    print response
    return response

def main (argv):

    # Loading the response data into a dict variable
    # json.loads takes in only binary or string variables so using content to fetch binary content
    # Loads (Load String) takes a Json file and converts into python data structure (dict or list, depending on JSON)
    with open('pokedex.txt', 'r') as infile:
        pokedex = infile.read()
        infile.close()
    pokedexDict = json.loads(pokedex)
    pokemons = pokedexDict["pokemon"]
    count = 0
    for pokemon in pokemons:
        resource_uri = pokemon["resource_uri"]
        pokemonResponse = makeRequest(baseURL+resource_uri)
        if (pokemonResponse.ok) :
            pokemonDict = json.loads(pokemonResponse.content)
            if (len(pokemonDict["sprites"]) > 1 ):
                sprite_uri = pokemonDict["sprites"][1]["resource_uri"]
                sprite_response = makeRequest(baseURL +sprite_uri)
                if(sprite_response.ok) :
                    sprite_dict = json.loads(sprite_response.content)
                    img_uri = sprite_dict["image"]
                    uri_splits = img_uri.split("/")
                    img_name = uri_splits[len(uri_splits)-1]
                    print ("Getting "+img_name + " from " +baseURL+img_uri)
                    opener = urllib2.build_opener()
                    opener.addheaders = [('User-Agent',"Mozilla/50 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36")]
                    imgResponse=opener.open(baseURL+img_uri)
                    if(imgResponse.getcode() == 200) :
                        with open(img_name, 'wb') as outfile:
                            outfile.write(imgResponse.read())
                            outfile.close()
                            count+=1
                    else:
                        print(imgResponse.html())    
                        break
            else :
                sprite_response.raise_for_status()
                break
        else :
            pokemonResponse.raise_for_status()
            break
    
    print ("stopped at pokemon " + str(count))
            

if __name__ == "__main__":
    main(sys.argv)