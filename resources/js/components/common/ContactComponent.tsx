import AddContactModal from '@/components/contacts/AddContactModal';
import ContactTimeline from '@/components/contacts/ContactTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactComponent({ contactableType, contactableId, contacts }) {
    return (
        <div className="">
            <div className="mb-3 flex justify-between">
                <div></div>
                <AddContactModal contactableType={contactableType} contactableId={contactableId} />
            </div>

            <Card className="bg-gray-100">
                <CardHeader>
                    <CardTitle>Contacts</CardTitle>
                </CardHeader>

                <hr className="-mt-2 border-1 border-gray-200" />

                <CardContent>
                    <ContactTimeline contacts={contacts} />
                </CardContent>
            </Card>
        </div>
    );
}
