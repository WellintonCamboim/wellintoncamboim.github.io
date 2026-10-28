import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import pt from "../../messages/pt.json";

type MessageTree = { [key: string]: string | MessageTree };

const catalogs: Record<string, MessageTree> = { pt, en, es };

function flatten(tree: MessageTree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      acc[path] = value;
    } else {
      Object.assign(acc, flatten(value, path));
    }
    return acc;
  }, {});
}

describe("i18n message parity", () => {
  const flattened = Object.fromEntries(
    Object.entries(catalogs).map(([locale, tree]) => [locale, flatten(tree)]),
  );
  const locales = Object.keys(flattened);
  const referenceKeys = Object.keys(flattened[locales[0]]).sort();

  it.each(locales)("%s has the same keys as the other locales", (locale) => {
    expect(Object.keys(flattened[locale]).sort()).toEqual(referenceKeys);
  });

  it.each(locales)("%s has no empty values", (locale) => {
    const empty = Object.entries(flattened[locale]).filter(([, value]) => value.trim() === "");
    expect(empty).toEqual([]);
  });
});
