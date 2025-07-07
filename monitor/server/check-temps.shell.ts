import { $ } from "bun";

const MAX_LINES = 100;
const CWD = process.env.SERVER_BASE_DIR;

async function writeCurrentTemp() {
    const output = await $`vcgencmd measure_temp`.text();
    const temp = output.match(/[-+]?[0-9]*\.?[0-9]+/)[0];

    const result = [temp, new Date().toISOString(), "C"];
    const lines = parseInt(await $`cat ${CWD}/temps.txt | wc -l`.text());

    if (lines >= MAX_LINES) {
        // delete the first line to maintain the limit
        await $`sed -i 1d ${CWD}/temps.txt`;
    }

    await $`echo ${result.join(",")} >> ${CWD}/temps.txt`;
}

const interval = setInterval(function () {
    writeCurrentTemp();
}, 1000);
