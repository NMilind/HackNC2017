# Get arguments from the commandline
import sys
filename = sys.argv[1]
outputname = sys.argv[2]
print("Mining %s" % filename)

# Open CSV file
output = ""
vals = {}
valsLs = []
with open(filename, "r") as f:
    f.readline()
    for line in f:
        spt = str(line).strip().split(",")
        vals[spt[0]] = float(spt[1])
        if (float(spt[1]) != -1.0):
            valsLs.append(float(spt[1]))

valMin = min(valsLs)
valMax = max(valsLs)
for key in vals:
    output += "coloration[\"" + str(key) + "\"] = " + str(vals[key]) + ";\n"
output += "coloration[\"Minimum\"] = " + str(valMin) + ";\n"
output += "coloration[\"Maximum\"] = " + str(valMax) + ";\n"

with open(outputname, "w") as f:
    f.write(output)