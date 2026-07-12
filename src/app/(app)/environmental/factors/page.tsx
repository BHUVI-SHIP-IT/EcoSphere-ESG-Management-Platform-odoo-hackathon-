"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { Icon } from "@/components/icon";
import { emissionFactors, categoryName } from "@/lib/mock";
import { fmtDate } from "@/lib/format";
import { toast } from "sonner";

export default function FactorsPage() {
  return (
    <>
      <PageHeader
        title="Emission Factors"
        description="Master configuration for converting operational quantities into CO₂e. Used by auto-calculation."
        actions={
          <Button onClick={() => toast.success("New emission factor — form would open here")}>
            <Icon name="sliders-horizontal" className="h-4 w-4" /> Add factor
          </Button>
        }
      />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Factor library</CardTitle>
          <CardDescription>{emissionFactors.length} factors across {new Set(emissionFactors.map((f) => f.categoryId)).size} categories</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">kg CO₂e / unit</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {emissionFactors.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{categoryName(f.categoryId)}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{f.unit}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{f.co2ePerUnit}</TableCell>
                  <TableCell className="text-muted-foreground">{f.source}</TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(f.updatedAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icon name="sliders-horizontal" className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast("Edit factor")}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("Duplicate factor")}>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-danger"
                          onClick={() => toast.error("Delete factor")}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
