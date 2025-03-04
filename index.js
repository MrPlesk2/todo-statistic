const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todoComments = []

files.forEach(file => {
    const matches = [...file.matchAll(/\/\/\s*TODO\s*(.*?)(?=\r?\n|$)/g)];
    matches.forEach(match => {
        const comment = String(match[1]);
        todoComments.push({comment:comment,
                           data:parseCommentWithUsername(comment),
                           important:(comment.match('!') || []).length})
        }
    ); 
});



console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    const commandSplited = command.split(' ');
    switch (commandSplited[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            todoComments.forEach(comment => {
                console.log(comment.comment);
            });
            break;
        case 'important':
            todoComments.forEach(comment => {
                if (comment.important > 0) {
                    console.log(comment.comment);
                }
            });
            break;
        case 'user':
            printAllForUser(commandSplited[1]);
            break;
        case 'sort':
            
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function printAllForUser(username) {
    todoComments
        .map(x=>parseCommentWithUsername(x.comment))
        .filter(x => x !== null)
        .filter(x => x.username.toLowerCase() === username.toLowerCase())
        .map(x=>`${x.username} ${x.date} ${x.comment}`)
        .forEach(x=>console.log(x));
}

function parseCommentWithUsername(line) {
    const matches = line.match(/^(.*?);\s*(.*?);\s*(.*)$/);
    if (matches === null) {
        return null;
    }
    const date = new Date(matches[2]);
    return {username: matches[1], date: date, comment: matches[3]};
}


// TODO you can do it!
