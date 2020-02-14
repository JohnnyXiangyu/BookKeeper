# BookKeeper

CLI bookkeeping app implemented with sqlite

## Some Features

(all of which are in progress)  
command line operations  
symmetric key encryption (using a C++ module)  
I'm too lazy to add proper doc

## TODOs  

### When there's no db file at given location, prompt the user to create a new one  

### Store config files under user directories  

### Design a new record scheme  

* every line contain change in all resources  
* calculation should be performed on every entry addition for a subtotal of all resources  
* every time resource refreshes (e.g. new month starts with new budget), add an entry with special data that can be captured by a SQL query, use these special lines to separate different time periods in records (and also allow synchronization of statistics)  

### Modify the current option set to

* write (add new entry)  
* read (get entries; for now just implement reading a the most current month.)  
* break (end this month and start the next one with a single special entry)  
