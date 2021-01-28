/**
 * 
 * @param {array} args 
 * @return {{input: Function}}
 */
module.exports = (args) => {
    const inputs = [];
    let input_lists = [];
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        if (arg.startsWith('-') || arg.startsWith('--')) {
            i++;
            let options = [];
            while (typeof args[i] === 'string' && !(args[i].startsWith('-') || args[i].startsWith('--')) === true) {
                options.push(args[i]);
                i++;
            }
            inputs.push({name: arg, values: options});
            i--;
        } else {
            inputs.push({arg});
        }
    }

    const call = [];

    return  {
        option(index, exec) {
            const find = this.find(input_lists[index]);
            if (find !== false) {
                call.push(exec.bind(this, find.values))
            }
        },

        input(options, descriptions) {
            input_lists = options.map((opt, i) => (opt.push(descriptions[i]), opt));
        },

        log() {
            input_lists.forEach(list => {
                const desc = list.pop();
                const cmd = list.join(',');
                console.log(`${cmd}\t\t\t${desc}\n`)
            });
        },
        
        find(options) {
            for (const input of inputs) {
                if (options.indexOf(input.name)>=0) {
                    return input;
                }
            }
            return false;
        },

        run(fn) {
            call.forEach(call => call());
            if (typeof fn === 'function') fn.call(this);
        }
    }
}