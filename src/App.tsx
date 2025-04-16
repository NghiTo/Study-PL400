import ScrollToTopButton from "./components/ui/ScrollToTopButton";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { QuestionData } from "./types/data";
import data from "./data/documents.json";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

function App() {
  const [query, setQuery] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<QuestionData[]>([]);

  const handleSearch = () => {
    const lowerQuery = query.toLowerCase().trim();
    const filtered = (data as QuestionData[]).filter((item) => {
      const questionMatch = item.question?.toLowerCase().includes(lowerQuery);
      const answerChoicesMatch = Object.values(item.choices || {}).some(
        (choice) => choice.toLowerCase().includes(lowerQuery)
      );

      return questionMatch || answerChoicesMatch;
    });

    setResults(filtered);
    setSearchTerm(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  function highlightText(text: string, keyword: string) {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <span key={i} className="bg-yellow-300 font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Exam Question Finder
        </h1>
        <p className="text-muted-foreground">
          Search for exam questions and their correct answers
        </p>
      </div>

      <div className="relative mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for a question or topic..."
            className="pl-10 pr-28 h-12 text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ textOverflow: "ellipsis" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-22 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg font-bold"
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>
        <Button
          className="absolute right-1 top-1 h-10 cursor-pointer"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      <div className="pb-4">
        <h2 className="text-xl font-semibold">Results</h2>
        {results.length === 0 && (
          <p className="text-sm text-muted-foreground">No results found.</p>
        )}
      </div>

      <div className="space-y-6">
        {results.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base whitespace-pre-line">
                {highlightText(item.question, searchTerm)}
              </CardTitle>
              {item.answerDescription && (
                <CardDescription className="whitespace-pre-line">
                  {item.answerDescription}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent>
              {Array.isArray(item.questionImage) &&
                item.questionImage.length > 0 && (
                  <div className="mb-4">
                    {item.questionImage.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="question"
                        className="mb-2 rounded border"
                      />
                    ))}
                  </div>
                )}

              {Array.isArray(item.answerImage) &&
                item.answerImage.length > 0 && (
                  <div className="mb-4">
                    {item.answerImage.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="answer"
                        className="mb-2 rounded border"
                      />
                    ))}
                  </div>
                )}

              {item.choices && (
                <div className="space-y-2">
                  {Object.entries(item.choices).map(([key, value]) => {
                    const isCorrect = item.answer.split("").includes(key);

                    return (
                      <div
                        key={key}
                        className={`border p-2 rounded ${
                          isCorrect
                            ? "border-green-500 bg-green-300 font-medium"
                            : "border-gray-300"
                        }`}
                      >
                        <span className="mr-2 font-semibold">{key}.</span>
                        {highlightText(value, query)}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default App;
