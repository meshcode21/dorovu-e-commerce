"use client";

import { useApplications, useApproveApplication, useRejectApplication, type CrafterApplication, type ApplicationStatus } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function ApplicationsPage() {
  const [filter, setFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | undefined>('PENDING');
  const { data: applications, isLoading } = useApplications(filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6 border-b border-sand pb-4">
        <Button 
          variant={filter === 'PENDING' ? 'default' : 'ghost'} 
          className={filter === 'PENDING' ? 'bg-forest text-white' : 'text-ink-60'}
          onClick={() => setFilter('PENDING')}
        >
          Pending
        </Button>
        <Button 
          variant={filter === 'APPROVED' ? 'default' : 'ghost'} 
          className={filter === 'APPROVED' ? 'bg-forest text-white' : 'text-ink-60'}
          onClick={() => setFilter('APPROVED')}
        >
          Approved
        </Button>
        <Button 
          variant={filter === 'REJECTED' ? 'default' : 'ghost'} 
          className={filter === 'REJECTED' ? 'bg-forest text-white' : 'text-ink-60'}
          onClick={() => setFilter('REJECTED')}
        >
          Rejected
        </Button>
        <Button 
          variant={filter === undefined ? 'default' : 'ghost'} 
          className={filter === undefined ? 'bg-forest text-white' : 'text-ink-60'}
          onClick={() => setFilter(undefined)}
        >
          All
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest" />
        </div>
      ) : applications?.length === 0 ? (
        <Card className="p-12 text-center bg-white border-sand shadow-sm">
          <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-forest-subtle" />
          </div>
          <h3 className="text-xl font-display font-semibold text-ink mb-2">No applications found</h3>
          <p className="text-ink-60">There are no {filter ? filter.toLowerCase() : ''} applications to review right now.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications?.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ application }: { application: CrafterApplication }) {
  const { mutate: approve, isPending: isApproving } = useApproveApplication();
  const { mutate: reject, isPending: isRejecting } = useRejectApplication();

  const isPending = application.status === 'PENDING';

  return (
    <Card className="p-6 bg-white border-sand shadow-sm flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-display font-semibold text-ink">{application.storeName}</h3>
            <p className="text-sm text-ink-60 mt-1">Applicant: {application.user.firstName} {application.user.lastName} ({application.user.email})</p>
          </div>
          <StatusBadge status={application.status} />
        </div>
        
        <div>
          <span className="inline-flex px-2 py-1 bg-sand/50 text-ink-60 rounded text-xs font-mono font-medium tracking-wide uppercase mb-3">
            {application.craftType}
          </span>
          <p className="text-sm text-ink leading-relaxed bg-cream p-4 rounded-lg border border-sand whitespace-pre-wrap">
            {application.description}
          </p>
        </div>
        
        <p className="text-xs text-ink-30">
          Applied on: {new Date(application.createdAt).toLocaleDateString()}
        </p>
      </div>

      {isPending && (
        <div className="flex md:flex-col gap-3 shrink-0 pt-2 border-t md:border-t-0 md:border-l border-sand md:pl-6 mt-4 md:mt-0 justify-center">
          <Button 
            className="bg-forest hover:bg-forest/90 text-white w-full shadow-sm"
            onClick={() => approve(application.id)}
            disabled={isApproving || isRejecting}
          >
            {isApproving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            Approve
          </Button>
          <Button 
            variant="outline"
            className="border-error text-error hover:bg-error/10 w-full"
            onClick={() => reject(application.id)}
            disabled={isApproving || isRejecting}
          >
            {isRejecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
            Reject
          </Button>
        </div>
      )}
    </Card>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  if (status === 'APPROVED') {
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-forest/10 text-forest rounded-full text-xs font-semibold">
        <CheckCircle className="w-3.5 h-3.5" /> Approved
      </span>
    );
  }
  if (status === 'REJECTED') {
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-error/10 text-error rounded-full text-xs font-semibold">
        <XCircle className="w-3.5 h-3.5" /> Rejected
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 bg-ink-10 text-ink-60 rounded-full text-xs font-semibold">
      <Clock className="w-3.5 h-3.5" /> Pending
    </span>
  );
}
