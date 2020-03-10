#! /usr/bin/python3
import os
import time

while True:
    os.system('bash git_fetch_pull.sh >> git_logs.log')
    
    localtime = time.asctime(time.localtime(time.time()))
    os.system('printf "CURRENT TIME:' + localtime + ', END OF ONE UPDATE\n" >> git_logs.log')

    print('updated')
    time.sleep(1800)

exit()
