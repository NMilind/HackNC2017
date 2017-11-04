# Get arguments from the commandline
import sys
filename = sys.argv[1]
outputname = sys.argv[2]
print("Mining %s" % filename)

# Load latitudes and longitudes for state
latlongs = {}
with open("data/latlong.csv", "r") as f:
    for line in f:
        spt = str(line).strip().split(",")
        latlongs[spt[0]] = [ float(spt[1]), float(spt[2]) ]

print("Latitudes and Longitudes Loaded")

# Open CSV file
output = ""
with open(filename, "r") as f:
    f.readline()
    for line in f:
        spt = str(line).strip().split(",")
        output += "new google.maps.LatLng(%s, %s)," % (latlongs[spt[0]][0], latlongs[spt[0]][1]) + "\n"
        for i in range(int(float(spt[1]))):
            output += "new google.maps.LatLng(%s, %s)," % (latlongs[spt[0]][0], latlongs[spt[0]][1]) + "\n"

with open(outputname, "w") as f:
    f.write(output)