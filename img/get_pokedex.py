import json
#import urllib
import requests
import sys

baseURL = "http://pokeapi.co/"

def makeRequest (URI) :
    response = requests.get(URI)
    print response
    return response

def main (argv):
    pokedexResponse = makeRequest (baseURL+"api/v1/pokedex/1")
    if(pokedexResponse.ok):

        # Loading the response data into a dict variable
        # json.loads takes in only binary or string variables so using content to fetch binary content
        # Loads (Load String) takes a Json file and converts into python data structure (dict or list, depending on JSON)
        with open('pokedex.txt', 'w') as outfile:
            outfile.write(pokedexResponse.content)
            outfile.close()
    else:
    # If response code is not ok (200), print the resulting http error code with description
        pokedexResponse.raise_for_status()

if __name__ == "__main__":
    main(sys.argv)