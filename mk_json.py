from netCDF4 import Dataset
import numpy as np
import json
import sys


def convert(theFile="a.nc", names=["delpwr", "wnpar",  "spsi", "ws", "wr", "wz", "wphi"], first_ray=0, last_ray=4, first_sample=0, last_sample=400):

    xkey = "wx"
    ykey = "wy"
    zkey = "wz"
    sizekey = "delpwr"
    colorkey = "wnpar"

    rootgrp = Dataset(theFile, "r", format="NETCDF4")
    nray = rootgrp.variables["nray"]
    nrayelt = rootgrp.variables["nrayelt"][:]
    values = {}
    for name in names:
        values[name] = rootgrp.variables[name][:]
    values["wx"] = np.multiply(values["wr"], np.cos(values["wphi"]))
    values["wy"] = np.multiply(values["wr"], np.sin(values["wphi"]))

    for i in range(values[sizekey].shape[0]):
        values[sizekey][i] = values[sizekey][i]/values[sizekey][i][0]

    for i in range(values[colorkey].shape[0]):
        values[colorkey][i] = values[colorkey][i]/values[colorkey][i][0]

    for key in values.keys():
        values[key] = values[key][first_ray:last_ray, first_sample:last_sample].tolist()

    world = {"nray" : last_ray-first_ray, "names" : names, "xkey" : xkey, "ykey" : ykey,"zkey" : zkey, "sizekey" : sizekey, "colorkey" : colorkey, "values" : values}

    return world


    #world = {"nray":5, "nrayelt":nrayelt[0:5].tolist(), "minx":min(min(wxl)),"miny":min(min(wyl)),"minz":min(min(wzl)), "maxx":min(max(wxl)),"maxy":max(max(wyl)),"maxz":max(max(wzl)),"wx":wxl,"wy":wyl, "wz":wzl, "value":spsil}
    #world = {"nray":nray, "nrayelt":nrayelt.to_list(), "wx":wx.to_list(),"wy":wy.to_list(), "wz":wz.to_list(), "value":spsi.to_list()}
    json.dumps(world)
    import json
    with open("genray.json", "w") as outfile:
        json.dump(world, outfile)








def getMeta(theFile):
    rootgrp = Dataset(theFile, "r", format="NETCDF4")
    return list((i for i in rootgrp.variables))

if __name__ == "__main__":
    print convert(theFile=sys.argv[1])