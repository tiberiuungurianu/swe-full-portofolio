import type { ProjectSection } from "@/content/projects";

type ProjectNotesProps = {
  sections: ProjectSection[];
};

/** Turns `backticks` in content strings into inline code. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    return <span key={index}>{part}</span>;
  });
}

/** Longer build notes shown on a project page, below the short summary. */
export function ProjectNotes({ sections }: ProjectNotesProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="project-notes">
      {sections.map((section) => (
        <section key={section.heading} className="project-notes__block">
          <h2>{section.heading}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
          {section.points ? (
            <ul>
              {section.points.map((point) => (
                <li key={point.label}>
                  <strong>{point.label}.</strong> <RichText text={point.detail} />
                </li>
              ))}
            </ul>
          ) : null}
          {section.table ? (
            <table
              className={
                section.table.columns.length > 2
                  ? "store-table store-table--labeled"
                  : "store-table"
              }
            >
              <thead>
                <tr>
                  {section.table.columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) =>
                      index === 0 ? (
                        <th key={`${row[0]}-0`} scope="row">
                          <RichText text={cell} />
                        </th>
                      ) : (
                        <td
                          key={`${row[0]}-${index}`}
                          data-label={section.table?.columns[index]}
                        >
                          <RichText text={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </section>
      ))}
    </div>
  );
}
