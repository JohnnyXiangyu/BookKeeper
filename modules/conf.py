# API:
# read config file
# write config file
# config file for now is a json file

import os
import json
import db_utils as db


class TableStructure:
    '''
    this class is used only to share statically defined table structure\n
    there's currently no plan to add dynamic database design (for now cuz I'm dumb)\n
    '''

    def __init__(self):
        '''
        define a bunch of data structures that represent some shared info
        '''
        # TODO: redesign this! think about how to prompt the user for change?
        self.columns = {'DATE': 'TEXT', 'TIMEZONE': 'TEXT', 'AVAILABLE_CHANGE': 'REAL', 'SAVED_CHANGE': 'REAL', 
                        'CASH_CHANGE': 'REAL', 'CATEGORY': 'TEXT', 'DETAIL': 'TEXT', 'AVAILABLE_SUBTOTAL': 'REAL', 'SAVED_SUBTOTAL': 'REAL'}
        self.name = 'myFinance'
        self.config_file_name = 'bookeeper_config.json'


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
    setup function used for first-day-of-use scenario\n
    actually, there's only file path to-be-configured since ... this script is quite specific
    '''
    new_table = TableStructure()
    filePath = ''

    # initialize file path, user input or default (/home/username/Documents)
    filePath = input(
        'Please enter directory for database storage (absolute path); press ENTER to locate your db at a default local directory \n')
    if filePath == '':
        filePath = os.path.join(os.path.expanduser('~'), 'Documents')

    # try to create a config file (must be under /home/username/Documents), not found -> create directory first
    try:
        confFile = open(os.path.join(os.path.expanduser('~'),
                                     'Documents', new_table.config_file_name), 'w')
    except FileNotFoundError:
        os.mkdir(os.path.join(os.path.expanduser('~'), 'Documents'))
        confFile = open(os.path.join(os.path.expanduser('~'),
                                     'Documents', new_table.config_file_name), 'w')

    # write the json
    json.dump({'DB path': filePath}, confFile, indent=4)
    confFile.close()

    # prompt the usr whether to skip database initialization
    if input('Enter "No!"(capital) to skip database initialization (do this only when you already have a db file)\n') == 'No!':
        return 1

    # create new database
    (conn, stat) = db.db_open(os.path.join(
        filePath, '/bkp.db'), True)  # force a file creation
    print('database module responds ' + str(stat))
    conn.close()

    # create table
    db.db_newTable(tbName=new_table.name, tbSchema={
                   'DATE': 'TEXT', 'TIMEZONE': 'TEXT', 'AMOUNT': 'REAL', 'CATEGORY': 'TEXT', 'DETAIL': 'TEXT'}, location=os.path.join(filePath, '/bkp.db'))
    return 0
