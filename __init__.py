#! /usr/bin/python3

import modules.db_utils as db
import modules.conf as conf
from optparse import OptionParser
import sys
import os
from datetime import date
import time
import json

# this file contains upper-level logic corresponding to my own usage
# that is: book keeping
# what do I need to keep a me-style financial notebook?
# date (timezone), spending, category, detail&comments
# working logic?
# parse all arguments
# 1. input data: format data into dictionary, then use db.tb_insert()
# 2. output data: specify number of days to look into, then retrieve that amount of rows
# 3. incase both are given, do input first
# setup is required when config file is missing. [v]

filePath = ''

template_table = conf.TableStructure()


# def firstDaySetup():
#     '''
#     setup function used for first-day-of-use scenario
#     actually, there's only file path to-be-configured since ... this script is quite specific
#     '''
#     global filePath

#     filePath = input(
#         'Please enter directory for database storage (absolute path)\n')
#     confFile = open('/usr/share/Bookkeeper' + '/config.json', 'w')
#     json.dump({'DB path': filePath}, confFile, indent=4)
#     confFile.close()
#     if input('Enter "N"(capital) to skip database initialization (do this only when you already have a db file)\n') == 'N':
#         return 1
#     (conn, stat) = db.db_open(filePath + '/bkp.db', True)  # force a file creation
#     conn.close()
#     db.db_newTable(tbName=tb_name, tbSchema=template_table.columns, location=filePath + '/bkp.db')
#     return 0


if __name__ == "__main__":
    # check configuration status
    confPresence = conf.checkConfPresence(
        '/usr/share/Bookkeeper' + '/config.json')
    if confPresence == -1:
        c = input('Configuration file not found, configure now? Y/n\n')
        if c == 'n' or c == 'N':
            exit(120)
        else:
            conf.firstDaySetup()
    elif confPresence == 1:
        print('"config.json" is used as a directory name, please remove that directory from installed location')
        exit()

    confFile = open('/usr/share/Bookkeeper' + '/config.json', 'r')
    try:
        confObj = json.load(confFile)
        confFile.close()
        filePath = confObj['DB path']
    except (KeyError, json.decoder.JSONDecodeError):
        print(
            'Configuration file mis-formatted. Please remove existing configuration file and try again.')

    # parse options
    version_msg = "%prog 0.1 beta"
    usage_msg = """%prog [OPTION]... FILE\n
    Simple bookkeeping utility."""
    parser = OptionParser(version=version_msg, usage=usage_msg)
    parser.add_option("-w", "--write", action="store_ture", dest="write",
                      help="add a spending record of specified amount")
    parser.add_option("-r", "--read", action="store_true", dest="read",
                      help="read latest given number of lines of financial record")
    parser.add_option("-b", "--break", action="store_true",
                      dest="break", help="break records, start a new time section")
    options, args = parser.parse_args(sys.argv[1:])

    if vars(options)['newRecord']:
        # auto-gen information
        tz = time.tzname[1]  # how would this perform in China?
        newRecord = {}
        newRecord.update({'DATE': "'" + str(date.today()) + "'",
                          'TIMEZONE': "'" + str(tz) + "'", 'AMOUNT': vars(options)['newRecord']})
        # user inputs
        # TODO: add loop that run through all fields, like: available, saved, ... and have user input change inputs
        category = "'" + input('Specify transection category: ') + "'"
        detail = "'" + input('Specify transection detail and comments: ') + "'"
        newRecord.update({'CATEGORY': str(category), 'DETAIL': str(detail)})
        # confirmation
        print('Record to upload: ' + str(newRecord))
        confirm = input('Confirm? y/N\n')
        if confirm != 'y' and confirm != 'Y':
            print('Cancelled.')
            exit()
        # upload data
        db.tb_insert(tbName=template_table.name, location=filePath +
                     '/bkp.db', lnContent=newRecord)
        print('New record uploaded.')

    if vars(options)['lines']:
        found = db.tb_retrieve(tbName=template_table.name, columns=[
            'DATE', 'TIMEZONE', 'AMOUNT', 'CATEGORY', 'DETAIL'], count=int(vars(options)['lines']), location=filePath+'/bkp.db')
        print('DATE, TIMEZONE, AMOUNT, CATEGORY, DETAIL')
        for row in found:
            for item in row:
                print(item, end=', ')
            print('')
        print('Records retrieved.')
