#! /usr/bin/python3
import os

while True:
    os.system('bash git_fetch_pull.sh >> git_logs.log')
    os.system('printf "END OF ONE UPDATE \n\n" >> git_logs.log')
    print('updated')
    sleep(1800)

exit()
