const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todoComments = []

files.forEach(file => {
    const matches = [...file.matchAll(/\/\/\s*TODO\s*(.*?)(?=\r?\n|$)/g)];
    matches.forEach(match => {
        const comment = String(match[1]);
        todoComments.push({comment:comment,
                           important:comment.includes('!')})
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
    switch (command) {
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
                if (comment.important) {
                    console.log(comment.comment);
                }
            });
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
