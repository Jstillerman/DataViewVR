from netCDF4 import Dataset
import numpy as np
import json
import sys
import json

def convert(theFile):

    rootgrp = Dataset(theFile, "r", format="NETCDF4")
    nray = rootgrp.variables["nray"][0]
    nrayelt = rootgrp.variables["nrayelt"][:]
    values = {}

#Shape of all appropriate vars
    varshape = rootgrp.variables["delpwr"].shape
#List on all usable var names
    varnames = list(x for x in rootgrp.variables.keys() if rootgrp.variables[x].shape == varshape)
#Dict on name and long names
    varlongnames = {}
#Fill varlongnames and values
    for name in varnames:
        varlongnames[name] = rootgrp.variables[name].long_name
        values[name] = rootgrp.variables[name][:]
#Calc x, y
    values["wx"] = np.multiply(values["wr"], np.cos(values["wphi"]))
    values["wy"] = np.multiply(values["wr"], np.sin(values["wphi"]))

    for key in values.keys():
        values[key] = values[key].tolist()

    world = {"nray" : int(nray), "varnames" : varlongnames, "values" : values}

    return json.dumps(world)


if __name__ == "__main__":
    print convert(theFile=sys.argv[1])