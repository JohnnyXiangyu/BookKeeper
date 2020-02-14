# API:
# read config file
# write config file
# config file for now is a json file

import os
import json
import db_utils as db


class TableStructure:
    '''
    this class is used only to share statically defined table structure
    there's currently no plan to add dynamic database design (for now cuz I'm dumb)
    '''

    def __init__(self):
        '''
        define a bunch of data structures that represent some shared info
        '''
        self.columns = {'DATE': 'TEXT', 'TIMEZONE': 'TEXT', 'AMOUNT': 'REAL',
                        'CATEGORY': 'TEXT', 'DETAIL': 'TEXT', 'AVAILABLE': 'REAL', 'SAVED': 'REAL'}
        self.name = 'myFinance'


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


# this function is defined in __init__.py
def firstDaySetup():
    '''
    setup function used for first-day-of-use scenario
    actually, there's only file path to-be-configured since ... this script is quite specific
    '''
    new_table = TableStructure()
    filePath = ''

    filePath = input(
        'Please enter directory for database storage (absolute path)\n')
    
    confFile = open('/usr/share/Bookkeeper' + '/config.json', 'w')
    json.dump({'DB path': filePath}, confFile, indent=4)
    confFile.close()
    if input('Enter "N"(capital) to skip database initialization (do this only when you already have a db file)\n') == 'N':
        return 1
    (conn, stat) = db.db_open(filePath + '/bkp.db', True)  # force a file creation
    conn.close()
    db.db_newTable(tbName=new_table.name, tbSchema={
                   'DATE': 'TEXT', 'TIMEZONE': 'TEXT', 'AMOUNT': 'REAL', 'CATEGORY': 'TEXT', 'DETAIL': 'TEXT'}, location=filePath + '/bkp.db')
    return 0
