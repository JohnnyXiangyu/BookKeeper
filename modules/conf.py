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
            return 0  # target found
    else:
        return -1  # target not found


def firstDaySetup():
    '''
    setup function used for first-day-of-use scenario
    actually, there's only file path to-be-configured since ... this script is quite specific
    '''
    global filePath

    filePath = input(
        'Please enter directory for database storage (absolute path)\n')
    confFile = open('/usr/share/Bookkeeper' + '/config.json', 'w')
    json.dump({'DB path': filePath}, confFile, indent=4)
    confFile.close()
    if input('Enter "N"(capital) to skip database initialization (do this only when you already have a db file)\n') == 'N':
        return 1
    (conn, stat) = db.db_open(filePath + '/bkp.db', True)  # force a file creation
    conn.close()
    db.db_newTable(tbName=tb_name, tbSchema={
                   'DATE': 'TEXT', 'TIMEZONE': 'TEXT', 'AMOUNT': 'REAL', 'CATEGORY': 'TEXT', 'DETAIL': 'TEXT'}, location=filePath + '/bkp.db')
    return 0
