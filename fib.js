function fact(n) {
  if (n <= 1) return 1;
  fact.cache = fact.cache ?? [];

  if (!fact.cache[n]) {
    fact.cache[n] = n * fact(n - 1);
  };

  return fact.cache[n];
}
