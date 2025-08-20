import { useState, useEffect } from "react";
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
  const [fuse, setFuse] = useState<any | undefined>();
  const [results, setResults] = useState<IconMeta[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 100);

  useEffect(() => {
    const fetchMetaData = async () => {
      if (pack === "google") {
        const response = await fetch(`/api/icons-metadata`);
        const body = await response.text();
        const metadata = JSON.parse(body.replace(`)]}'`, ""));
        const initFuse = new Fuse(metadata.icons, { keys: ["name", "tags"] });
        setFuse(initFuse);
      } else {
        const response = await fetch(`/api/local-icons/metadata?pack=lucide`);
        const metadata = await response.json();
        const initFuse = new Fuse(metadata.icons, { keys: ["name", "tags"] });
        setFuse(initFuse);
      }
    };
    fetchMetaData();
  }, [pack]);

  useEffect(() => {
    if (fuse && debouncedSearchTerm?.length > 1 && debouncedSearchTerm?.length < 15) {
      // PASS THE TERM TO OUR FUSE
      const currentResults = fuse
        .search(debouncedSearchTerm)
        .map((result) => result.item as IconMeta);

      // SPLICE THE LARGE RESULT
      const splicedCurrentResult = currentResults.splice(0, 20);

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
          margin-bottom: var(--space-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .iconSearch__container {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          width: 100%;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          padding: var(--space-sm) var(--space-md);
          z-index: 9;
          border-radius: var(--radius-md);
          margin-bottom: var(--space-md);
          transition: all 0.2s ease-in-out;
        }
        .iconSearch__container:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-light);
        }
        .iconSearch__container svg {
          fill: var(--text-secondary);
          height: 24px;
          width: 24px;
        }
        .iconSearch input {
          background-color: transparent;
          width: 100%;
          height: 100%;
          padding: 0;
          outline: none;
          border: none;
          font-size: 1rem;
          color: var(--text-primary);
          font-weight: 500;
        }
        .iconSearch input::placeholder {
          color: var(--text-tertiary);
        }
        .iconSearch__autoCompleteItemsWrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
          gap: var(--space-sm);
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          padding: var(--space-md);
          margin-bottom: var(--space-sm);
          width: 100%;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          backdrop-filter: blur(10px);
        }
        .iconSearch__autoCompleteItem {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: var(--accent-bg);
          border-radius: var(--radius-md);
          padding: var(--space-sm) var(--space-md);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          border: 1px solid transparent;
        }
        .iconSearch__autoCompleteItem:hover {
          background-color: var(--accent-primary);
          border-color: var(--accent-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        .iconSearch__autoCompleteItem:active {
          transform: translateY(0);
        }
        .iconSearch__autoCompleteItem svg {
          fill: var(--text-primary);
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
