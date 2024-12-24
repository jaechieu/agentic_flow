"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProcessedData {
  [key: string]: number;
}

interface ProcessedContentProps {
  data: ProcessedData | null;
  pdfName: string;
}

export function ProcessedContent({ data, pdfName }: ProcessedContentProps) {
  if (!data) return null;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">
          Processed Content from "{pdfName}"
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Item</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(data).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">
                  {key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </TableCell>
                <TableCell>
                  ${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
