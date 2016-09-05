import json
import urllib2
import requests
import sys
import os.path


baseURL = "http://pokeapi.co/"
maxPokemon = 718 #update to newest
def makeRequest (URI) :
    response = requests.get(URI)
    print response
    return response

def main (argv):

    # Loading the response data into a dict variable
    # json.loads takes in only binary or string variables so using content to fetch binary content
    # Loads (Load String) takes a Json file and converts into python data structure (dict or list, depending on JSON)
    for i in range(1,maxPokemon):
        fname = str(i)+'.png'
        if(not os.path.isfile(fname)): 
            img_url = baseURL + 'media/img/' + fname
            print ("Getting "+fname + " from " + img_url)
            opener = urllib2.build_opener()
            opener.addheaders = [('User-Agent',"Mozilla/50 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36")]
            imgResponse=opener.open(img_url)
            if(imgResponse.getcode() == 200) :
                with open(fname, 'wb') as outfile:
                    outfile.write(imgResponse.read())
                    outfile.close()
            else:
                print(imgResponse.html())    
                break
            

if __name__ == "__main__":
    main(sys.argv)