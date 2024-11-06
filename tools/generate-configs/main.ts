import { parse } from 'https://deno.land/std@0.192.0/csv/mod.ts';

const tenantId = 'fQeZITIAeY7rfGTPYjGX';
const appColorText = 'buildAppColor("#997525", "#8F6B1B")';

async function generateConfig(filePath: string) {
  const csvContent = await Deno.readTextFile(filePath);
  const parsed = parse(csvContent, {
    skipFirstRow: true,
    columns: ['appName', 'urlPath', 'liffId'],
  });

  const configEntries = parsed
    .map(
      (row) => `
  "${row.urlPath}": {
    tenantUidHeader: "${tenantId}",
    appColor: ${appColorText},
    pageMeta: {
      title: "${row.appName}",
      favicon: "/favicons/chompy-house.ico"
    },
    liffId: "${row.liffId}"
  }`,
    )
    .join(',');

  const configString = `const configs = {${configEntries}
};
`;

  return configString;
}

async function main() {
  if (Deno.args.length < 1 || Deno.args.length > 2) {
    console.error('Usage: deno run --allow-read --allow-write generate_config.ts <path_to_csv_file> [output_file]');
    Deno.exit(1);
  }

  const inputFilePath = Deno.args[0];
  const outputFilePath = Deno.args[1];

  try {
    const configCode = await generateConfig(inputFilePath);

    if (outputFilePath) {
      await Deno.writeTextFile(outputFilePath, configCode);
      console.log(`Config has been written to ${outputFilePath}`);
    } else {
      console.log(configCode);
    }
  } catch (error) {
    console.error('Error processing the CSV file:', error.message);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
