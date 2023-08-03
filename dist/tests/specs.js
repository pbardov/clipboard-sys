"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../index");
const path_1 = __importDefault(require("path"));
const buffer_image_size_1 = __importDefault(require("buffer-image-size"));
const image_size_1 = __importDefault(require("image-size"));
const fs_extra_1 = __importDefault(require("fs-extra"));
describe('Read text from clipboard', () => {
    const testText = 'test text';
    before(async () => {
        const pathToTestFile = path_1.default.join(process.cwd(), 'tests', 'data', 'from', 'testFileFrom.txt');
        if (!fs_extra_1.default.existsSync(pathToTestFile)) {
            await fs_extra_1.default.writeFile(pathToTestFile, Buffer.from('test'));
        }
    });
    after(async () => { });
    it('Write read text clipboard', async () => {
        await index_1.clipboard.writeText(testText);
        const text = await index_1.clipboard.readText();
        (0, chai_1.expect)(text).to.be.equal(testText);
    });
    it('Write read to file image clipboard', async () => {
        const pathToTestPic = path_1.default.join(process.cwd(), 'tests', 'data', 'tempPic.png');
        const pathToReadPic = path_1.default.join(process.cwd(), 'tests', 'data', 'readPic.png');
        const sizeTestPic = (0, image_size_1.default)(pathToTestPic);
        await index_1.clipboard.writeImage(pathToTestPic);
        await index_1.clipboard.readImage(pathToReadPic);
        const sizeReadPic = (0, image_size_1.default)(pathToReadPic);
        try {
            if (fs_extra_1.default.existsSync(pathToReadPic)) {
                await fs_extra_1.default.unlink(pathToReadPic);
            }
        }
        catch (_a) { }
        (0, chai_1.expect)(JSON.stringify(sizeTestPic)).to.be.equal(JSON.stringify(sizeReadPic));
    });
    it('Write read to buffer image clipboard', async () => {
        const pathToTestPic = path_1.default.join(process.cwd(), 'tests', 'data', 'tempPic.png');
        const pathToReadPic = path_1.default.join(process.cwd(), 'tests', 'data', 'readPic.png');
        const bufferTempPic = await fs_extra_1.default.readFile(pathToTestPic);
        const sizeTestPic = (0, buffer_image_size_1.default)(bufferTempPic);
        await index_1.clipboard.writeImage(bufferTempPic);
        const bufferReadPic = await index_1.clipboard.readImage();
        const sizeReadPic = (0, buffer_image_size_1.default)(bufferReadPic);
        try {
            if (fs_extra_1.default.existsSync(pathToReadPic)) {
                await fs_extra_1.default.unlink(pathToReadPic);
            }
        }
        catch (_a) { }
        (0, chai_1.expect)(JSON.stringify(sizeTestPic)).to.be.equal(JSON.stringify(sizeReadPic));
    });
    it('Read files clipboard', async () => {
        const pathToTestFile = path_1.default.join(process.cwd(), 'tests', 'data', 'from', 'testFileFrom.txt');
        await index_1.clipboard.writeFiles(pathToTestFile, pathToTestFile, pathToTestFile);
        const files = await index_1.clipboard.readFiles();
        (0, chai_1.expect)(files.every((f) => fs_extra_1.default.existsSync(f))).to.be.equal(true);
    });
    it('Copy paste files clipboard', async () => {
        const pathToTestFile = path_1.default.join(process.cwd(), 'tests', 'data', 'from', 'testFileFrom.txt');
        const destinationFolder = path_1.default.join(process.cwd(), 'tests', 'data', 'to');
        const pathToCopiedFile = path_1.default.join(destinationFolder, 'testFileFrom.txt');
        if (process.platform === 'win32') {
            await index_1.clipboard.writeFiles(pathToTestFile);
        }
        await index_1.clipboard.pasteFiles('Copy', destinationFolder, pathToTestFile);
        const isExist = fs_extra_1.default.existsSync(pathToCopiedFile);
        try {
            if (fs_extra_1.default.existsSync(pathToCopiedFile)) {
                await fs_extra_1.default.unlink(pathToCopiedFile);
            }
        }
        catch (_a) { }
        (0, chai_1.expect)(isExist).to.be.equal(true);
    });
    it('Cut paste files clipboard', async () => {
        const pathToTestFile = path_1.default.join(process.cwd(), 'tests', 'data', 'from', 'testFileFrom.txt');
        const destinationFolder = path_1.default.join(process.cwd(), 'tests', 'data', 'to');
        const pathToCopiedFile = path_1.default.join(destinationFolder, 'testFileFrom.txt');
        if (process.platform === 'win32') {
            await index_1.clipboard.writeFiles(pathToTestFile);
        }
        await index_1.clipboard.pasteFiles('Cut', destinationFolder, pathToTestFile);
        const isExistTemp = fs_extra_1.default.existsSync(pathToTestFile);
        const isExistDestination = fs_extra_1.default.existsSync(pathToCopiedFile);
        try {
            if (fs_extra_1.default.existsSync(pathToCopiedFile)) {
                await fs_extra_1.default.unlink(pathToCopiedFile);
            }
        }
        catch (_a) { }
        if (!isExistTemp) {
            await fs_extra_1.default.writeFile(pathToTestFile, Buffer.from('test'));
        }
        (0, chai_1.expect)(isExistTemp).to.be.equal(false);
        (0, chai_1.expect)(isExistDestination).to.be.equal(true);
    });
});
//# sourceMappingURL=specs.js.map