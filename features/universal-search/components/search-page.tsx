"use client";

import { SearchExperience } from "@/features/universal-search/components/search-experience";

import styles from "../styles/universal-search.module.css";

export function UniversalSearchPage() {
  return (
    <section className={styles.page}>
      <header>
        <h1>Search Health Decoded</h1>
        <p>Search lessons, tools, terms, stories, and resources.</p>
      </header>
      <SearchExperience />
    </section>
  );
}
