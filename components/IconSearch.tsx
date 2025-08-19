import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import useDebounce from "../lib/useDebounce";
import Icon from "./Icon";
import { motion, AnimatePresence } from "framer-motion";

type IconMeta = { name: string; version: number; tags?: string[] };
type Props = {
  setSelectedIconName: (name: string) => void;
  setSelectedIconVersion: (v: number) => void;
  pack?: "google" | "lucide";
};

function IconSearch({ setSelectedIconName, setSelectedIconVersion, pack = "google" }: Props) {
  const [fuse, setFuse] = useState<Fuse<IconMeta> | undefined>();
  const [results, setResults] = useState<IconMeta[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 100);

  useEffect(() => {
    let fetchMetaData = async () => {
      if (pack === "google") {
        const response = await fetch(`/api/icons-metadata`);
        const body = await response.text();
        const metadata = JSON.parse(body.replace(`)]}'`, ""));
        const initFuse = new Fuse<IconMeta>(metadata.icons, { keys: ["name", "tags"] });
        setFuse(initFuse);
      } else {
        const response = await fetch(`/api/local-icons/metadata?pack=lucide`);
        const metadata = await response.json();
        const initFuse = new Fuse<IconMeta>(metadata.icons, { keys: ["name", "tags"] });
        setFuse(initFuse);
      }
    };
    fetchMetaData();
  }, [pack]);

  useEffect(() => {
    if (fuse && debouncedSearchTerm?.length > 1 && debouncedSearchTerm?.length < 15) {
      // PASS THE TERM TO OUR FUSE
      let currentResults = fuse
        .search(debouncedSearchTerm)
        .map((result) => result.item as IconMeta);

      // SPLICE THE LARGE RESULT
      let splicedCurrentResult = currentResults.splice(0, 20);

      // STORE SPLICED RESULT IN STATE
      setResults(splicedCurrentResult);
      console.log(results);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <>
      <div className="iconSearch">
        <div className="iconSearch__container">
          <Icon name="image_search" version={12} />
          <input
            type="text"
            placeholder="Search Icon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <AnimatePresence>
          {results.length > 1 && (
            <motion.div
              initial={{ y: -140, scaleY: 0 }}
              animate={{ y: 0, scaleY: 1 }}
              exit={{ opacity: 0 }}
              className="iconSearch__autoCompleteItemsWrapper"
            >
              {results.map((result) => (
                <div
                  key={`${result.name}-${result.version}`}
                  className="iconSearch__autoCompleteItem"
                  onClick={() => {
                    setSelectedIconName(result.name);
                    setSelectedIconVersion(result.version);
                    setSearchTerm("");
                    setResults([]);
                  }}
                >
                  {pack === "google" ? (
                    <Icon name={result.name} version={result.version} />
                  ) : (
                    <span style={{ color: "#fff", fontSize: 14 }}>{result.name}</span>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .iconSearch {
          width: 100%;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .iconSearch__container {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          background-color: #fff;
          padding: 10px 20px;
          z-index: 9;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .iconSearch__container svg {
          fill: #555;
          height: 30px;
          width: 30px;
        }
        .iconSearch input {
          background-color: #fff;
          width: 100%;
          height: 100%;
          padding: 2px 0 0 0;
          outline: none;
          border: none;
          font-size: 1.3rem;
          color: #222;
          font-weight: 600;
        }
        .iconSearch__autoCompleteItemsWrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(50px, 0.5fr));
          grid-gap: 1rem;
          background-color: #333;
          padding: 20px;
          margin-bottom: 10px;
          width: 100%;
          border-radius: 10px;
        }
        .iconSearch__autoCompleteItem {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #161616;
          border-radius: 8px;
          padding: 10px 20px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .iconSearch__autoCompleteItem:hover {
          background-color: #222;
          transform: scale(1.1);
        }
        .iconSearch__autoCompleteItem:active {
          background-color: #141414;
          transform: scale(0.9);
        }
        .iconSearch__autoCompleteItem svg {
          fill: #fff;
        }
        @media only screen and (max-width: 700px) {
          .iconSearch input {
            font-size: 1rem;
          }
          .iconSearch__container svg {
            fill: #555;
            height: 25px;
            width: 25px;
          }
        }
      `}</style>
    </>
  );
}

export default IconSearch;
