import sqlite3
import os

# API:
# open database
# create table (I don't want to inlcude dropping table)
# insert into database
# select from database

# Internal Method
# decrypt/encrypt using a C++ module


def db_open(location='', force=False):
    '''
    argument location should be absolute path to file (since file storage is detached from this app)
    return -1 if file exists
    return 0 if connection succeeded (either open or creation)
    return 1 if location is a directory
    return -2 for any other error
    '''
    fileName = os.path.basename(location)
    filePath = os.path.dirname(location)
    stat = 0
    if fileName in os.listdir(filePath):
        if os.path.isdir(location) != False:
            return (None, 1)  # target is not a file
    elif not force:
        return (None, -1)  # file doesn't exist, no forced creation
    elif force:
        stat = -1  # file doesn't exist, forced creation

    # open
    conn = None
    try:
        conn = sqlite3.connect(location)
        print(sqlite3.version)  # debug message
    except sqlite3.Error as e:
        print(e)
        return (None, -2)

    return (conn, stat)  # either 0 or -1, just open or newly created


def db_newTable(tbName='', tbSchema={}, location=''):
    '''
    '''
    # generate a sqlite command
    command = 'CREATE TABLE IF NOT EXISTS ' + \
        tbName + '(ID INT PRIMARY KEY AUTOINCREMENT'
    items = {}
    for key, value in tbSchema.items():
        items.update({key: value})
        command += ', ' + key + ' ' + value
    command += ');'

    # commit the command
    # if file doesn't exist, create a new one
    (conn, stat) = db_open(location, True)
    if conn == None:
        return stat
    try:
        cur = conn.cursor()
        cur.execute(command)
    except sqlite3.Error as e:
        print(e)
        return -2
    finally:
        conn.close()
        
    return stat


def tb_insert(tbName='', lnContent={}, location=''):
    command = 'INSERT INTO ' + tbName + ' [('
    # add field names
    for key in lnContent.keys():
        command += key + ', '
    command = command.rstrip(', ')
    command += ')] VALUES ('
    # add field values
    # TODO: add timestamp
    for value in lnContent.values():
        command += value + ', '
    command = command.rstrip(', ')
    command += ');'

    # execute
    (conn, stat) = db_open(location, False)
    if conn == None:
        return stat
    try:
        cur = conn.cursor()
        cur.execute(command)
    except sqlite3.Error as e:
        print(e)
        return -2
    finally:
        conn.close()

    return stat


def tb_retrieve():
    pass
