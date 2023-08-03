"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa = require("execa");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const __1 = require("../..");
class LinuxClipboard {
    async readFiles() {
        const files = await this.readText();
        if (files) {
            const isPathExist = files.split(' ').every((f) => {
                return fs_extra_1.default.existsSync(f);
            });
            return isPathExist ? files.split(' ') : [];
        }
        return [];
    }
    async pasteFiles(action, destinationFolder, ...files) {
        if (action === __1.FilesActionEnum.Copy) {
            await execa(`xclip-copyfile ${files.join(' ')}`, {
                stdio: 'inherit',
                shell: true,
            });
        }
        else {
            await execa(`xclip-cutfile ${files.join(' ')}`, {
                stdio: 'inherit',
                shell: true,
            });
        }
        await execa(`xclip-pastefile`, {
            shell: true,
            cwd: destinationFolder,
        });
    }
    async writeFiles(...files) {
        const isPathExist = files.every((f) => {
            return fs_extra_1.default.existsSync(f);
        });
        if (!isPathExist) {
            throw new Error(`No such paths ${files.join(' ')}`);
        }
        const dirNames = files.map((f) => {
            return path_1.default.dirname(f);
        });
        const formattedDir = dirNames.join(' ');
        const formattedBase = files.map((f) => {
            const base = path_1.default.basename(f);
            return `-o -name "${base}"`;
        });
        if (formattedBase.length) {
            formattedBase[0] = formattedBase[0].replace('-o', '');
        }
        try {
            await execa(`find ${formattedDir} ${formattedBase.join(' ')} | xclip -i -selection clipboard -t text/uri-list`, {
                stdio: 'inherit',
                shell: true,
            });
            return true;
        }
        catch (error) {
            throw new Error(`cannot write text due to clipboard error: ${error.message}`);
        }
    }
    async readText() {
        const { stdout, stderr } = await execa('xclip  -selection clipboard -o', {
            shell: true,
            stripFinalNewline: false,
        });
        if (stderr) {
            throw new Error(`cannot read text from clipboard error: ${stderr}`);
        }
        return stdout;
    }
    async writeText(text) {
        try {
            await execa('xclip -i -selection clipboard', {
                stdio: ['pipe', 'pipe', 'inherit'],
                shell: true,
                input: text,
            });
        }
        catch (error) {
            throw new Error(`cannot write text due to clipboard error: ${error.message}`);
        }
    }
    async readImage(file) {
        const { stdout, stderr } = await execa('xclip -selection clipboard -t image/png -o | base64', { shell: true });
        if (stderr) {
            throw new Error(`cannot read image from clipboard error: ${stderr}`);
        }
        const buffer = Buffer.from(stdout, 'base64');
        if (typeof file === 'string') {
            await fs_extra_1.default.writeFile(file, buffer);
            return buffer;
        }
        else {
            return buffer;
        }
    }
    async writeImage(file) {
        let path = '';
        if (typeof file !== 'string') {
            const pathToTemp = path_1.default.join(process.cwd(), 'temp.png');
            await fs_extra_1.default.writeFile(pathToTemp, file);
            if (fs_extra_1.default.existsSync(pathToTemp)) {
                path = pathToTemp;
            }
            else {
                throw new Error("Temp file wasn't created");
            }
        }
        else {
            path = file;
        }
        const { stdout, stderr } = await execa(`file -b --mime-type '${path}'`, {
            shell: true,
        });
        if (stderr) {
            throw new Error(`cannot read file by path ${file}`);
        }
        try {
            await execa(`xclip -selection clipboard -t ${stdout} -i ${path}`, {
                stdio: 'inherit',
                shell: true,
            });
        }
        catch (error) {
            throw new Error(`cannot write image to clipboard error: ${error.message}`);
        }
        if (typeof file !== 'string') {
            try {
                if (fs_extra_1.default.existsSync(path)) {
                    await fs_extra_1.default.unlink(path);
                }
            }
            catch (_a) { }
        }
    }
}
exports.default = LinuxClipboard;
//# sourceMappingURL=linux.js.map