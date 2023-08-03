import DarwinClipboard from './src/platform/darwin';
import LinuxClipboard from './src/platform/linux';
import WindowsClipboard from './src/platform/windows';
export var FilesActionEnum;
(function (FilesActionEnum) {
    FilesActionEnum["Copy"] = "Copy";
    FilesActionEnum["Cut"] = "Cut";
})(FilesActionEnum || (FilesActionEnum = {}));
export const clipboard = (() => {
    switch (process.platform) {
        case 'darwin':
            return new DarwinClipboard();
        case 'win32':
            return new WindowsClipboard();
        case 'linux':
            return new LinuxClipboard();
        default:
            throw new Error('unsupported os');
    }
})();
