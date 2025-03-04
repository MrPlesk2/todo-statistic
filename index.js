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
                           important:(comment.match(/!/g) || []).length})
        }
    ); 
});

let maxUserLength = 0;
const maxDateLength = 10;
let maxCommentLength = 0;

todoComments.forEach(comment => {
    if (comment.data){
        maxUserLength = Math.max(maxUserLength, comment.data.username.length);
        maxCommentLength = Math.max(maxCommentLength, comment.data.comment.length);
    } else {
        maxCommentLength = Math.max(maxCommentLength, comment.comment.length);
    }
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
            writeTable(todoComments);
            break;
        case 'important':
            writeTable(todoComments.filter(item => item.important > 0));
            break;
        case 'user':
            writeTable(todoComments.filter(item => item.data && item.data.username === commandSplited[1]));
            break;
        case 'sort':
            sortTodos(commandSplited[1]);
            writeTable(todoComments);
            break;
        case 'date':
            const filterDate = new Date(commandSplited[1]);
            writeTable(todoComments.filter(item => item.data && item.data.date >= filterDate));
            break;
        default:
            console.log('wrong command');
            break;
    }
}
function sortTodos(sortRule) {
    switch (sortRule) {
        case 'importance':
            todoComments.sort((x, y) => y.important - x.important)
            break;
        case 'user':
            todoComments.sort((x, y) => {
                if (x.data === null && y.data) {
                    return 1
                } else if (x.data === null && y.data === null) {
                    return 0
                } else {
                    return -1;
                }
            });
            break;
        case 'date':
            todoComments.sort((x, y) => {
                if (x.data && y.data) {
                    return y.data.date - x.data.date
                } else if (x.data === null) {
                    return 1
                } else {
                    return -1;
                }
            });
    }

}

function parseCommentWithUsername(line) {
    const matches = line.match(/^(.*?);\s*(.*?);\s*(.*)$/);
    if (matches === null) {
        return null;
    }
    const date = new Date(matches[2]);
    return {username: matches[1], date: date, comment: matches[3]};
}

function writeTable(items)
{
    console.log(` ! |  ${'user'.padEnd(maxUserLength)}  |  ${'date'.padEnd(maxDateLength)}  | comment`);
    console.log('-'.repeat(15 + maxUserLength + maxDateLength + maxCommentLength));
    items.forEach(item => writeComment(item));
    console.log('-'.repeat(15 + maxUserLength + maxDateLength + maxCommentLength));
}

function writeComment(item)
{
    
    if (item.data) {
        console.log(` ${item.important > 0 ? '!' : ' '} |  ${item.data.username.padEnd(maxUserLength)}  |  ${(item.data.date.getFullYear()  + "-" + (item.data.date.getMonth()+1) + "-" + item.data.date.getDate()).padEnd(maxDateLength)}  | ${item.data.comment}`)
    } else {
        console.log(` ${item.important > 0 ? '!' : ' '} |  ${"".padEnd(maxUserLength)}  |  ${"".padEnd(maxDateLength)}  | ${item.comment}`)
    }
}

// TODO you can do it!
