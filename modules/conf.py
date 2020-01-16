# API:
# read config file
# write config file
# config file for now is a json file

import os
import json

def checkConfPresence(location=''):
    '''
    check in given directory if file is present
    1: target is not file
    0: file is present
    -1: file is not present
    '''
    fileName = os.path.basename(location)
    filePath = os.path.dirname(location)
    if fileName in os.listdir(filePath):
        if os.path.isdir(location) != False:
            return 1  # target is not a file
        else:
            return 0 # target found
    else:
        return -1 # target not found
