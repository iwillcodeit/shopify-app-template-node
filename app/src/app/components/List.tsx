function getData() {
  return new Promise<string[]>((r) => {
    r(["Apple", "Pie", "Jam", "Bread"]);
  });
}

export async function Server() {
  const data = await getData();

  return (
    <ul>
      {data.map((food) => (
        <li>{food}</li>
      ))}
    </ul>
  );
}
