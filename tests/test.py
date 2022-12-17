import requests

def homePageTest():
  try:
    return requests.get("http://localhost:3000")
  except:
    raise Exception("Couldn't reach to localhost:3000")

data = homePageTest()
if not data.content:
  raise Exception("Something went wrong.")