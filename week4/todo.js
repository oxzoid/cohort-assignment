const { Command } = require('commander');
const fs = require('fs');
const program = new Command();

let taskarr = [];
let statusUp= 'pending';
const path = "C:\\Users\\Pranav\\Documents\\code\\projects\\cohort 3\\week4\\todo.json";

program
  .name('todo')
  .description('todo CLI')
  .version('0.2.1');

program.command('add')
  .description('adds a task')
  .argument('<task>', 'task to add')
  .action((task) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          taskarr = [];
        } else {
          console.log("Error reading file:", err);
          return;
        }
      } else {
        if (data.trim() !== '') {
          try {
            taskarr = JSON.parse(data);
          } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            return;
          }
        }
      }

      const lastTask = taskarr[taskarr.length - 1];
      let id = lastTask ? lastTask.id + 1 : 1;
      const newTask = { id, task, statusUp };
      taskarr.push(newTask);

      fs.writeFile(path, JSON.stringify(taskarr, null, 2), "utf8", (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log("Task added successfully.");
        }
      });
    });
  });

  program.command('show')
  .description('shows all tasks')
  .action(() => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          taskarr = [];
          console.log('no tasks');
        } else {
          console.log("Error reading file:", err);
          return;
        }
      } else {
        if (data.trim() !== '') {
          try {
            // taskarr = JSON.parse(data);
            console.log(data)
          } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            return;
          }
        }
      }
    });
  });

program.command('remove')
  .description('removes a task')
  .argument('<task number>', 'task to remove by id')
  .action((id) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log("Error reading file:", err);
        return;
      }
      
      try {
        taskarr = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return;
      }

      taskarr = taskarr.filter(task => task.id !== parseInt(id));

      fs.writeFile(path, JSON.stringify(taskarr, null, 2), "utf8", (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log(`Task with id ${id} removed successfully.`);
        }
      });
    });
  });

program.command('status')
  .description('updates task status')
  .argument('<id>','id of task u want to update the status of')
  .action((id)=>{
    fs.readFile(path,"utf8",(err,data)=>{
      if(err){
        if(err.code=='ENOENT'){
          console.log('empty file');
        }
        else{
          console.log(err);
        }
      }
      else{
        try{
          taskarr=JSON.parse(data);
        }catch(parseError){
          console.log(parseError,'\n error parsing json file');
        }
      }
      let l=0;
      let r= taskarr.length-1;
      console.log(taskarr);
      id=parseInt(id);
      let found = false;

      while (l <= r) {
        let mid = Math.floor(l + (r - l) / 2);
        if (taskarr[mid].id === id) {
          taskarr[mid].statusUp = 'Done';
          found = true;
          break;
        } else if (taskarr[mid].id < id) {
          l = mid + 1;
        } else {
          r = mid - 1;
        }
      }
      console.log(taskarr)
      if (!found) {
        console.log(`Task with id ${id} does not exist.`);
      } else {
        fs.writeFile(path, JSON.stringify(taskarr, null, 2), "utf8", (err) => {
          if (err) {
            console.error("Error writing to file:", err);
          } else {
            console.log(`Task with id ${id} status updated successfully.`);
          }
        });
      }
    })
  })
  program.command('clear')
  .description('clears all task')
  .action(() => {
    taskarr = [];
      fs.writeFile(path, JSON.stringify(taskarr, null, 2), "utf8", (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log(`Tasks cleared`);
        }
      });
  });
program.parse();  
